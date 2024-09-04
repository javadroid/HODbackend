import UserModel from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

  const userAgent = req.headers['user-agent'];
  
  playgame(req.query.token, res
  );
};

async function playgame(access: string, res: any) {
  axios
    .post(
      "https://game-domain.blum.codes/api/v1/game/play",
      {},
      { headers: { Authorization: `Bearer ${access}` } }
    )
    .then((data) => {
      console.log("gameId", data.data.gameId);
      console.log("Playing Blum pls wait");
      res.send({
        message:"Playing Blum pls wait",
        
      })
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
      console.log(e.response.data.message);
      if (e.response.data.message === "not enough play passes") {
        // 
      } else if(e.response.data.message==="Invalid jwt token"){
        res.send(e.response.data.message);
      }
      else {
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
      console.log("gameClaim", data.points);

      playgame(access, res);
    })
    .catch((e) => {
      claimgame(access, data, res);
    });
}


export const Tomarket = async (req: any, res: any, next: any) => {
 
  const userAgent = req.headers['user-agent'];
    const data = await axios.post(
      "https://api-web.tomarket.ai/tomarket-game/v1/user/login",
      {
        from:"",
        init_data:"user=%7B%22id%22%3A5581602893%2C%22first_name%22%3A%22React.js%F0%9F%8D%85%20%F0%9F%A6%B4%F0%9F%86%93%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22reactjs32%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-2642908054693969306&chat_type=sender&auth_date=1725433705&hash=692d00f75409bd4a97788e2302fafde5171392d4e605663424a055f3e07c27ed",
        invite_code: "",
        is_bot: false
       }
    );
    console.log("accesstoken", data.data.data.access_token);
  // playgameTomarket(data.data.data.access_token,res);
  claimgameTomarket(
    data.data.data.access_token,
    {
      points: getRandomNumber(570, 600),
      game_id: "59bcd12e-04e2-404c-a172-311a0084587d",
    },
    res
  );

};

async function playgameTomarket(access: string, res: any) {
  axios
    .post(
      "https://api-web.tomarket.ai/tomarket-game/v1/game/play",
      {game_id: "59bcd12e-04e2-404c-a172-311a0084587d"},
      { headers: { Authorization: `${access}` } }
    )
    .then((data) => {
      console.log("gameId", data.data);
      if (data.data.message === "Invalid Token.") {
      return  res.send(data.data.message);
      }
      res.send({
        message:"Playing tomarket pls wait",
        
      })
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
      console.log(e.response.data.message);
      if (e.response.data.message === "not enough play passes") {
        res.send(e.response.data.message);
      } else if(e.response.data.message==="Invalid jwt token"){
        res.send(e.response.data.message);
      }
      else {
        playgameTomarket(access, res);
      }
    });
}

async function claimgameTomarket(access: any, data: any, res: any) {
  axios
    .post("https://api-web.tomarket.ai/tomarket-game/v1/game/claim", {
      game_id: "59bcd12e-04e2-404c-a172-311a0084587d",
      points: getRandomNumber(570, 600)
    }, {
      headers: { Authorization: `${access}` },
    })
    .then((data2) => {
      console.log("gameClaim", data.points,data2.data);

      playgameTomarket(access, res);
    })
    .catch((e) => {
      if (e.response.data.message === "Invalid jwt token") {
        res.send(e.response.data.message);
      }else if (e.response.data.message === "Token is not pass") {
        res.send(e.response.data.message);
      }else{
        console.log(e)
        claimgameTomarket(access, data, res);
      }
      
    });
}
function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
