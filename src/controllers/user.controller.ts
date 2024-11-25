import UserModel from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";
import createHttpError from "http-errors";
import axios from "axios";

export const searchUsers = async (req: any, res: any, next: any) => {
  try {
    const keyword = req.query.search;
    if (!keyword)
      throw createHttpError.BadGateway("Oops... Something wrong happened");

    //    const users = await searchUsersSerive(keyword)
    //    res.status(200).json(users)
  } catch (error) {
    next(error);
  }
};

export const getlogin = async (req: any, res: any, next: any) => {
  const userAgent = req.headers["user-agent"];
  
  playgame(req.query.token, res);
};

async function playgame(access: string, res: any) {
  axios
    .get(
      "https://game-domain.blum.codes/api/v2/game/play",
      
      { headers: { Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNfZ3Vlc3QiOmZhbHNlLCJ0eXBlIjoiQUNDRVNTIiwiaXNzIjoiYmx1bSIsInN1YiI6ImJiZWU0Y2I4LTY0Y2UtNDdlMy1hMDY5LWY5NWFhMjQ2Mzc5MCIsImV4cCI6MTcyODkwMDc5NiwiaWF0IjoxNzI4ODk3MTk2fQ.s-rIVuAwadD40N8f1cbxxsY4ab-Bqmcq5MP2PrDqnPo"}` } }
    )
    .then((data) => {
      console.log("gameId", data.data);
      console.log("Playing Blum pls wait");

      setTimeout((s: any) => {
        claimgame(
          access,
          {
            points: getRandomNumber(220, 270),
            gameId: data.data.gameId,
          },
          res
        );
      }, 32000);
    })
    .catch((e) => {
      console.log(e?.response?.data?.message || e.message);
      if (e?.response?.data?.message === "not enough play passes") {
        res.send(e?.response?.data?.message);
      } else if (e?.response?.data?.message === "Invalid jwt token") {
        res.send(e?.response?.data?.message);
      } else {
        playgame(access, res);
      }
    });
}

async function claimgame(access: any, data: any, res: any) {
  axios
    .post("https://game-domain.blum.codes/api/v1/game/claim", data, {
      headers: { Authorization: `Bearer ${access}` },
    })
    .then((data2) => {
      console.log("gameClaim", data2.data);

      playgame(access, res);
    })
    .catch((e) => {
      claimgame(access, data, res);
    });
}

export const Tomarket = async (req: any, res: any, next: any) => {
  const userAgent = req.headers["user-agent"];
  const data = await axios.post(
    "https://api-web.tomarket.ai/tomarket-game/v1/user/login",
    {
      from: "",
      init_data:
        "user=%7B%22id%22%3A5581602893%2C%22first_name%22%3A%22%F0%9F%90%88%E2%80%8D%E2%AC%9B%20%F0%9F%90%A4%20%2B%20React.js%F0%9F%8D%85%20%F0%9F%A6%B4%F0%9F%86%93%20%2B%20Gra-Gra%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22reactjs32%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-2642908054693969306&chat_type=sender&auth_date=1726731627&hash=28c0329afea0b72a9f03ab706d74bbf7f0251ff7701176c5c788334bc173f9c0",
        
      invite_code: "",
      is_bot: false,
    }
  );
  console.log("accesstoken", data.data);

  if (data.data.data.access_token) {
    playgameTomarket(data.data.data.access_token, res);
  } else {
    playgameTomarket(req.query.token, res);
  }
};

async function playgameTomarket(access: string, res: any) {
  axios
    .post(
      "https://api-web.tomarket.ai/tomarket-game/v1/game/play",
      { game_id: "59bcd12e-04e2-404c-a172-311a0084587d" },
      { headers: { Authorization: `${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblVzZXIiOnsidGVsX2lkIjoiNTU4MTYwMjg5MyIsImlkIjo5NTgxMDMsImZuIjoiUmVhY3QuanMiLCJsbiI6IiJ9LCJpYXQiOjE3Mjg4OTQ4NTksImV4cCI6MTczMTQ4Njg1OX0.zw5V3DS0OCyik4xODa8ld_9HX9cdey90B7v006vmfJs"}` } }
    )
    .then((data) => {
      console.log("gameId", data.data);
      if (
        data?.data?.message === "Invalid Token." ||
        data?.data?.message === "no chance"
      ) {
        return res.send(data.data.message);
      }

      console.log("Playing tomarket pls wait");
      setTimeout((s: any) => {
        claimgameTomarket(
          access,
          {
            points: getRandomNumber(570, 600),
            game_id: "59bcd12e-04e2-404c-a172-311a0084587d",
          },
          res
        );
      }, 32000);
    })
    .catch((e) => {
      console.log(e.response?.data?.message);
      console.log(e.message);
      if (e?.response?.data?.message === "not enough play passes") {
        res.send(e?.response?.data?.message);
      } else if (e?.response?.data?.message === "Invalid jwt token") {
        res.send(e?.response?.data?.message);
      } else {
        playgameTomarket(access, res);
      }
    });
}

async function claimgameTomarket(access: any, data: any, res: any) {
  axios
    .post(
      "https://api-web.tomarket.ai/tomarket-game/v1/game/claim",
      {
        game_id: "59bcd12e-04e2-404c-a172-311a0084587d",
        points: getRandomNumber(570, 600),
      },
      {
        headers: { Authorization: `${access}` },
      }
    )
    .then((data2) => {
      console.log("gameClaim", data2.data);

      playgameTomarket(access, res);
    })
    .catch((e) => {
      if (e?.response?.data?.message === "Invalid jwt token") {
        res.send(e?.response?.data?.message);
      } else if (e?.response?.data?.message === "Token is not pass") {
        res.send(e?.response?.data?.message);
      } else {
        console.log(e);
        claimgameTomarket(access, data, res);
      }
    });
}
function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export async function askGoogleAi( req: any, res: any) {

  const API_KEY = "AIzaSyBXoXXRqVoXnn" + "KEfsZqRz0omkQNUmLsC0s";
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const resp=await model.generateContent(req.body.message||`
   search and scrape blog posts or use any source Create a LinkedIn post for me, The post should focus on the latest technology updates or quick tutorials related to software or crypto development using little Text Format pick one of them.

Key Points to Include:
Latest Updates:

Discuss a recent update in a popular library or framework (e.g., React, Angular, Node.js) and its benefits.
Explain how to implement the update in a project and any potential downsides to be aware of.
Quick Tutorial: (if needed)

Provide a brief tutorial on a relevant topic, such as:
Building AI chatbots and automation.
Implementing and using AI APIs.
Developing decentralized applications (dApps) in Web3.
Include practical examples or code snippets to illustrate the tutorial.
Engagement:

Encourage fellow developers to share their experiences with the latest technologies or ask questions about the tutorial.
Invite discussion on how these updates and techniques can improve development practices.
Tone:
Informative and engaging, aimed at fostering knowledge-sharing within the tech community.

Please provide all information need 
    `)
res.send(resp.response.text())
    
}