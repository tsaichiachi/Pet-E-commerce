import React, { useState, useEffect  } from "react";
import ListD from "@/components/member/list-d";
import ListUserM from "@/components/member/list-user-m";
import { LiaListAltSolid } from "react-icons/lia";
import JobStatus from "@/components/member/job-status";
import axios from "axios";
import { useRouter } from 'next/router';


export default function Joblist() {
  const [currentScreen, setCurrentScreen] = useState(4);
  const [job, setJob] = useState([]);
  const [count,setCount]=useState([])
  const router = useRouter();
  const [activePage, setActivePage] = useState(1)




  const getJob = async (id) => {
    await axios
      .get(`http://localhost:3005/api/member-joblist/${id}`)
      .then((response) => {
        const data = response.data.result;
        console.log(data);
        setJob(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  const getCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3005/api/member-history/count/count`,
      );
      const data = response.data.result
      console.log(data);
       setCount(data)
    } catch (error) {
      console.error("Error:", error);
    }
   
  };

  let idCounts = [];
  count.forEach(v => {
    const mission_id = v.mission_id;
    if (idCounts[mission_id]) {
        idCounts[mission_id]++; // 如果 ID 已经存在，增加计数
    } else {
        idCounts[mission_id] = 1; // 如果 ID 不存在，初始化计数为 1
    }
  });


  let id
  useEffect(() => {    
  const token = localStorage.getItem("token");
  id=localStorage.getItem("id")
  // 沒有token
  if (!token) {
    router.push("/")

  }
  console.log(id);
  console.log(token)
    getJob(id);
    getCount()
  }, []);



  return (
    <>
      <div className="my-3">
        <ListUserM />
        <div className="d-flex justify-content-around py-2">
          <ListD />
          <div className="d-flex flex-column col-md-8 col-12 joblist  ">

          <p className="size-4 big mb-2">
                 <span className="my">▍</span>任務清單
                </p>
          
                <div className="">
                  <button
                    className={`size-6 listbutton first ${
                      currentScreen === 4 ? "pressed" : ""
                    }`}
                    onClick={() => {
                      setCurrentScreen(4);
                      setActivePage(1)

                    }}
                  >
                    全部
                  </button>
                  <button
                    className={` size-6 listbutton ${
                      currentScreen === 2 ? "pressed" : ""
                    }`}
                    onClick={() => {
                      setCurrentScreen(2);
                      setActivePage(1)

                    }}
                  >
                    未應徵
                  </button>
                  <button
                    className={` size-6 listbutton ${
                      currentScreen === 3 ? "pressed" : ""
                    }`}
                    onClick={() => {
                      setCurrentScreen(3);
                      setActivePage(1)

                    }}
                  >
                    已應徵
                  </button>
                  <button
                    className={`size-6 listbutton ${
                      currentScreen === 1 ? "pressed" : ""
                    }`}
                    onClick={() => {
                      setCurrentScreen(1);
                      setActivePage(1)

                    }}
                  >
                    刊登中
                  </button>
                  <button
                    className={`size-6 listbutton ${
                      currentScreen === 0 ? "pressed" : ""
                    }`}
                    onClick={() => {
                      setCurrentScreen(0);
                      setActivePage(1)

                    }}
                  >
                    已關閉
                  </button>

                </div>
                
             

                  <JobStatus job={job} currentScreen ={currentScreen } getJob={getJob} idCounts={idCounts} activePage={activePage} setActivePage={setActivePage}/>

            </div>
          </div>
        </div>
    </>
  );
}
