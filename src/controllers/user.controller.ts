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
  //   const data = await axios.post(
  //     "https://gateway.blum.codes/v1/auth/provider/PROVIDER_TELEGRAM_MINI_APP",
  //     {
  //       query:
  //         "query_id=AAFNgLBMAgAAAE2AsEylHu-H&user=%7B%22id%22%3A5581602893%2C%22first_name%22%3A%22React.js%20%F0%9F%A6%B4%F0%9F%86%93%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22reactjs32%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1725262227&hash=7f9614a46a6db97cc269977e0f6ac13120b66446886fd54442165b749177685c",
  //     }
  //   );
  //   console.log("accesstoken", data.data.token.access);

  playgame(req.query.token||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNfZ3Vlc3QiOmZhbHNlLCJ0eXBlIjoiQUNDRVNTIiwiaXNzIjoiYmx1bSIsInN1YiI6ImJiZWU0Y2I4LTY0Y2UtNDdlMy1hMDY5LWY5NWFhMjQ2Mzc5MCIsImV4cCI6MTcyNTI2NjQ0NCwiaWF0IjoxNzI1MjYyODQ0fQ.ggDM2WSzIvOOwrUBxt3Hiz5a1kgce2OTDApgpynOU-I",
    res
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
        res.send("Completed");
      } else {
        // playgame(access, res);
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

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
