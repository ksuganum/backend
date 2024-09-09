import React, { useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Timeline from "../../components/timeline/Timeline";
import { useParams } from "react-router-dom";

export default function Profile() {
  // PUBLIC_FOLDER を環境変数から取得
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);

  // useParams を使って URL からユーザー名を取得
  const { username } = useParams();

  // ユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users?username=${username}`);
        console.log("User data:", response.data); // デバッグ用
        setUser(response.data);
      } catch (error) {
        console.error(
          "Error fetching user:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchUser();
  }, [username]);

  // ファイル変更のハンドリング
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ファイルアップロードのハンドリング
  const handleUpload = async () => {
    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("userId", user._id);

      try {
        const res = await axios.post("/api/upload/cover", data);
        const updatedUser = { ...user, coverPicture: res.data.filename };
        setUser(updatedUser);
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }
  };

  return (
    <>
      <Topbar />

      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <section className="profileCover">
            <h1 className="hello">Hi</h1>
            {/* デバッグ用: PUBLIC_FOLDER と user.coverPicture の確認 */}
            {console.log("PUBLIC_FOLDER:", PUBLIC_FOLDER)}
            {console.log("user.coverPicture:", user.coverPicture)}

            <img
              src={
                user.coverPicture
                  ? PUBLIC_FOLDER + "/images/" + user.coverPicture
                  : PUBLIC_FOLDER + "/post/3.jpeg" // デフォルト画像
              }
              alt="Profile Cover"
              className="profileCoverImg"
            />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
          </section>

          <section className="below">
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </section>

          <div className="profileRightBottom">
            <Timeline username={username} gridView={true} pageType="profile" />
          </div>
        </div>
      </div>
    </>
  );
}
