import Web3 from "web3";
import UserModel, { NotificationModel } from "../models/user.model";
import {
  CommentModel,
  DocumentTokenModel,
  projectModel,
  scoreSheetModel,
  SessionModel,
  VoteModel,
} from "../models/schema.model";
import nodemailer from "nodemailer";
const web3 = new Web3();

export const getAllUser = async (req: any, res: any) => {
  const allUsers = await UserModel.find()
    .populate({ path: "supervisors.major", select: "fname lname type" }) // Populate the major supervisor field
    .populate({ path: "supervisors.minor", select: "fname lname type" }) // Populate the minor supervisor field
    .exec();
  console.log(allUsers);
  return res.status(200).json(allUsers);
};

export const addSession = async (req: any, res: any) => {
  const sessionCreated = await SessionModel.create({
    ...req.body,
  });
  return res.status(201).json(sessionCreated);
};
export const addComment = async (req: any, res: any) => {
  const sessionCreated = await CommentModel.create({
    ...req.body,
  });
  const project = await projectModel.findById(req.body.project_id);

  const user = await UserModel.findById(project.student_id);
  const major = await UserModel.findById(req.body.lecturer_id);
  await sendNotification({
    userdata: user,
    type: "Comment",
    message: `${major?.fname} ${major?.lname} (${major?.type}) commented of your project \n ${req.body.comment}`,
  });
  return res.status(201).json(sessionCreated);
};

export const addStudentProject = async (req: any, res: any) => {
  console.log(req.body);
  const sessionCreated = await projectModel.create({
    ...req.body,
  });
  await DocumentTokenModel.create({
    ...req.body,
    project_id: sessionCreated._id,
  });
  const user = await UserModel.findById(req.body.student_id);
  const major = await UserModel.findById(user?.supervisors?.major);
  const minor = await UserModel.findById(user?.supervisors?.minor);
  sendNotification({
    userdata: major,
    type: "Project Student",
    message: `Your project student ${user?.fname} ${user?.lname} (${user?.type}) just uploaded his/her project`,
  });
  sendNotification({
    userdata: minor,
    type: "Project Student",
    message: `Your project student ${user?.fname} ${user?.lname} (${user?.type}) just uploaded his/her project`,
  });

  return res.status(201).json(sessionCreated);
};
export const getStudentProject = async (req: any, res: any) => {
  let data;
  if (req.query.id) {
    data = await projectModel.find({ student_id: req.query.id });
  } else {
    data = await projectModel.find();
  }

  return res.status(200).json(data);
};

export const getDocument = async (req: any, res: any) => {
  const data = await DocumentTokenModel.find({
    project_id: req.params.id,
  });

  return res.status(200).json(data);
};
export const getCommect = async (req: any, res: any) => {
  const data = await CommentModel.find({
    project_id: req.params.id,
  })
    .populate({ path: "lecturer_id", select: "fname lname type picture" }) // Populate the minor supervisor field
    .exec();

  return res.status(200).json(data);
};

export const getNotification = async (req: any, res: any) => {
  const data = await NotificationModel.find({
    userid: req.params.id,
  })
    

  return res.status(200).json(data);
};
export const deleteProject = async (req: any, res: any) => {
  const data = await projectModel.findByIdAndDelete(req.params.id);

  return res.status(200).json(data);
};
export const deleteSession = async (req: any, res: any) => {
  const data = await SessionModel.findByIdAndDelete(req.params.id);

  return res.status(200).json(data);
};

export const editProject = async (req: any, res: any) => {
  const data = await projectModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (req.body.status) {
    const project = await projectModel.findById(req.params.id);
    const user = await UserModel.findById(project.student_id);

    sendNotification({
      userdata: user,
      type: "Project Status",
      message: `Your project ${project.name} was ${req.body.status}`,
    });
  }

  return res.status(200).json(data);
};

export const addDocument = async (req: any, res: any) => {
  console.log(req.body);

  const added = await DocumentTokenModel.create({
    ...req.body,
    project_id: req.params.id,
  });
  const project = await projectModel.findById(req.params.id);
  const user = await UserModel.findById(project?.student_id);
  const major = await UserModel.findById(user.supervisors.major);
  const minor = await UserModel.findById(user.supervisors.minor);
  sendNotification({
    userdata: major,
    type: "Project Student Update's Project Document",
    message: `Your project student ${user?.fname} ${user?.lname} (${user?.type}) updated his/her project document`,
  });
  sendNotification({
    userdata: minor,
    type: "Project Student Update's Project Document",
    message: `Your project student ${user?.fname} ${user?.lname} (${user?.type}) updated his/her project document`,
  });
  return res.status(201).json(added);
};

export const getStsupervisorProjectStudentudentProject = async (
  req: any,
  res: any
) => {
  console.log(req.body);
  const { lecturer_id } = req.query;
  const added = await UserModel.find({
    $or: [
      { "supervisors.major": lecturer_id },
      { "supervisors.minor": lecturer_id },
    ],
  });
  const dataq = [] as any[];

  for (let i = 0; i < added.length; i++) {
    const element = added[i];
    const projects = await projectModel.find({
      student_id: element._id,
    });

    const data = { ...(await element._doc) };
    data.project = projects[projects.length - 1];
    console.log(element.project);

    dataq.push(data);
  }

  return res.status(201).json(dataq);
};

export const session = async (req: any, res: any) => {
  const {
    external_examiner,
    internal_discussants,
    spgs,
    external_defense,
    internal_defense,
    proposal_defense,
  } = req.body;
  const ses = await SessionModel.findOneAndUpdate(
    {
      session: req.body.session,
      type: req.body.type,
      batch: req.body.batch,
    },
    {
      ...req.body,
    }
  );
  if (external_examiner) {
    const user = await UserModel.findById(external_examiner);
    sendNotification({
      userdata: user,
      type: "External Examiner",
      message: `You have assigned as the External Examiner for ${req.body.session} || ${req.body.batch}`,
    });
  }
  if (internal_discussants) {
    const user = await UserModel.findById(internal_discussants);
    sendNotification({
      userdata: user,
      type: "Internal Discussant",
      message: `You have assigned as the Internal Discussant for ${req.body.session} || ${req.body.batch}`,
    });
  }
  if (spgs) {
    const user = await UserModel.findById(spgs);
    sendNotification({
      userdata: user,
      type: "SPGS",
      message: `You have assigned as the SPGS for ${req.body.session} || ${req.body.batch}`,
    });
  }

  if (internal_defense) {
    let allarr=[] as any
    const ind1 = await UserModel.findById(ses?.internal_discussants);
    const ind2 = await UserModel.findById(ses?.external_examiner);
    const ind3 = await UserModel.findById(ses?.spgs);
    sendNotification({
      userdata: ind1,
      type: "Date for Internal Defense",
      message: `Date for internal defense is set on ${new Date(
        Number(internal_defense?.date)
      ).toDateString()}`,
    });
    sendNotification({
      userdata: ind2,
      type: "Date for Internal Defense",
      message: `Date for internal defense is set on ${new Date(
        Number(internal_defense?.date)
      ).toDateString()}`,
    });
    sendNotification({
      userdata: ind3,
      type: "Date for Internal Defense",
      message: `Date for internal defense is set on ${new Date(
        Number(internal_defense?.date)
      ).toDateString()}`,
    });

    const userTypes = [
      "HOD",
      "Provost",
      "Departmental PG Coordinator",
      "Faculty PG Coordinator",
      "Dean",
    ];
    const usersF = await UserModel.find({ type: { $in: userTypes } });

    const users = await UserModel.find({
      session: req.body.session,
      type: req.body.type,
      batch: req.body.batch,
    });
    allarr=[...usersF,...users]

    for (let i = 0; i < allarr.length; i++) {
      const element = allarr[i];
      sendNotification({
        userdata: element,
        type: "Date for Internal Defense",
        message: `Date for internal defense is set on ${new Date(
          Number(internal_defense?.date)
        ).toDateString()}`,
      });
    }
  }
  if (external_defense) {
    let allarr=[] as any
    const ind1 = await UserModel.findById(ses?.internal_discussants);
    const ind2 = await UserModel.findById(ses?.external_examiner);
    const ind3 = await UserModel.findById(ses?.spgs);
    sendNotification({
      userdata: ind1,
      type: "Date for Internal Defense",
      message: `Date for internal defense is set on ${new Date(
        Number(external_defense?.date)
      ).toDateString()}`,
    });
    sendNotification({
      userdata: ind2,
      type: "Date for Internal Defense",
      message: `Date for internal defense is set on ${new Date(
        Number(external_defense?.date)
      ).toDateString()}`,
    });
    sendNotification({
      userdata: ind3,
      type: "Date for Internal Defense",
      message: `Date for internal defense is set on ${new Date(
        Number(external_defense?.date)
      ).toDateString()}`,
    });
    const users = await UserModel.find({
      session: req.body.session,
      type: req.body.type,
      batch: req.body.batch,
    });
    const userTypes = [
      "HOD",
      "Provost",
      "Departmental PG Coordinator",
      "Faculty PG Coordinator",
      "Dean",
    ];
    const usersF = await UserModel.find({ type: { $in: userTypes } });

    allarr=[...usersF,...users]
    for (let i = 0; i < allarr.length; i++) {
      const element = allarr[i];
      sendNotification({
        userdata: element,
        type: "Date for Internal Defense",
        message: `Date for internal defense is set on ${new Date(
          Number(external_defense?.date)
        ).toDateString()}`,
      });
    }
  }
  if (proposal_defense) {
    let allarr=[] as any
    const ind1 = await UserModel.findById(ses?.internal_discussants);
    const ind2 = await UserModel.findById(ses?.external_examiner);
    const ind3 = await UserModel.findById(ses?.spgs);
    sendNotification({
      userdata: ind1,
      type: "Date for Proposal Defense",
      message: `Date for proposal defense is set on ${new Date(
        Number(proposal_defense?.date)
      ).toDateString()}`,
    });
    sendNotification({
      userdata: ind2,
      type: "Date for Proposal Defense",
      message: `Date for proposal defense is set on ${new Date(
        Number(proposal_defense?.date)
      ).toDateString()}`,
    });
    sendNotification({
      userdata: ind3,
      type: "Date for Proposal Defense",
      message: `Date for proposal defense is set on ${new Date(
        Number(proposal_defense?.date)
      ).toDateString()}`,
    });
    const userTypes = [
      "HOD",
      "Provost",
      "Departmental PG Coordinator",
      "Faculty PG Coordinator",
      "Dean",
    ];
    const users = await UserModel.find({
      section: req.body.session,
      type: req.body.type,
      batch: req.body.batch,
    });
    const usersF = await UserModel.find({ type: { $in: userTypes } });
    allarr=[...users,...usersF]
    console.log("dateddd",proposal_defense)
    for (let i = 0; i < allarr.length; i++) {
      const element = allarr[i];
    
      sendNotification({
        userdata: element,
        type: "Date for Proposal Defense",
        message: `Date for proposal defense is set on ${new Date(
          Number(proposal_defense?.date)
        ).toDateString()}`,
      });
    }

    
    
  }
  if (!ses) {
    const added = await SessionModel.create({
      ...req.body,
    });

     res.status(201).json(added);
  }

  console.log({
    external_examiner,
    internal_discussants,
    spgs,
    external_defense,
    internal_defense,
    proposal_defense,
  });
   res.status(201).json(ses);
};

export const getsession = async (req: any, res: any) => {
  const { lecturer_id, type, spgs, external } = req.query;
  let arr = [] as any[];
  const uusd = await UserModel.findById(lecturer_id);
  if (type == "Internal Discussant") {
    let ses = await SessionModel.find({
      $or: [{ internal_discussants: lecturer_id }],
    })
      .populate("internal_discussants")
      .populate("external_examiner")
      .populate("spgs");
    arr = [...arr, ...ses];
  } else if (type == "SPGS") {
    let ses = await SessionModel.find({
      $or: [{ spgs: lecturer_id }],
    })
      .populate("internal_discussants")
      .populate("external_examiner")
      .populate("spgs");
    arr = [...arr, ...ses];
  } else if (type == "Internal Discussant") {
    let ses = await SessionModel.find({
      $or: [{ external_examiner: lecturer_id }],
    })
      .populate("internal_discussants")
      .populate("external_examiner")
      .populate("spgs");
    arr = [...arr, ...ses];
  } else {
    if (
      ["HOD", "Provost", "Dean", "Departmental PG Coordinator"].includes(
        uusd.type
      )
    ) {
      console.log("object");
      let ses = await SessionModel.find()
        .populate("internal_discussants")
        .populate("external_examiner")
        .populate("spgs");
      arr = [...arr, ...ses];
    }
  }

  let arrfinal = [] as any[];
  for (let i = 0; i < arr.length; i++) {
    let ses = await UserModel.find({
      batch: arr[i].batch,
      section: arr[i].session,
      is_student: true,
    });

    const dataq = [] as any[];

    for (let j = 0; j < ses.length; j++) {
      const element = ses[j];
      const projects = await projectModel.find({
        student_id: element._id,
      });

      const data = { ...(await element._doc) };
      data.project = projects[projects.length - 1];
      console.log(element.project);
      if (data.project) {
        data.full = arr[i];
        dataq.push(data);
      }
    }
    arrfinal = [...arrfinal, ...dataq];
  }

  return res.status(200).json(arrfinal);
};

export const VoteSheet = async (req: any, res: any) =>{

  const sessionCreated = await VoteModel.create({
    ...req.body,
  });
  return res.status(201).json(sessionCreated);

}
export const getvoteSheet = async (req: any, res: any) =>{

  const sessionCreated = await VoteModel.find({...req.body});
  return res.status(200).json(sessionCreated);

}

export const scoreSheet = async (req: any, res: any) =>{

  const sessionCreated = await scoreSheetModel.create({
    ...req.body,
  });
  return res.status(201).json(sessionCreated);

}

export const getscoreSheet = async (req: any, res: any) =>{

  const sessionCreated = await scoreSheetModel.find({...req.body});
  return res.status(200).json(sessionCreated);

}

export const deletescore = async (req: any, res: any) =>{

  const sessionCreated = await scoreSheetModel.findByIdAndDelete(req.params.id);
  return res.status(200).json(sessionCreated);

}
const transporter = nodemailer.createTransport({
  host: "jamfortetech.com",
  port: 465,
  auth: {
    user: "emmanuel@jamfortetech.com",
    pass: "Simple@1010*",
  },
});
export const sendNotification = async ({
  userdata,
  type,
  message,
  otherid,
  email,
}: any) => {
  if (userdata) {
    await NotificationModel.create({
      userid: userdata?._id,
      type,
      message,
      otherid,
    });

    transporter.sendMail(
      {
        subject: type,
        to: userdata?.email,
        text: message,
        from: "emmanuel@jamfortetech.com",
      },
      function (error: any, body: any) {
        if (error) {
          console.log("Error sending email: ", error);
        } else {
          console.log("mail sent " + userdata?.email);
        }
      }
    );
  }
};
