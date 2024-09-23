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
  });

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

export const assign = async (req: any, res: any) => {
  const {
    external_examiner,
    internal_discussants,
    spgs,
    id,
    type,
    defense,
    external_defense,
    internal_defense,
    proposal_defense,
  } = req.body;
  const ses = await SessionModel.findByIdAndUpdate(
    id,
    {
      ...req.body,
    },
    { new: true }
  );
  console.log("defense?.status",defense)
  if(req.body[defense].status==="done"){
   for (let i = 0; i < ses[defense].students.length; i++) {
    const element = ses[defense].students[i];
    
    const votes = await VoteModel.find({
      defense,
      type,
      student_id:element,
      session: id,
    });
    console.log("votes", votes);
    // Initialize an object to hold lecturer scores
    const lecturerScores = {} as any;
  
    // Iterate over the data to aggregate scores
    votes.forEach((entry) => {
      const lecturerId = entry.lecturer_id;
      const scores = entry.scores;
  
      // Initialize the lecturer score if it doesn't exist
      if (!lecturerScores[lecturerId]) {
        lecturerScores[lecturerId] = 0;
      }
  
      // Sum scores for the lecturer
      const totalScore = Object.values(scores).reduce(
        (sum:any, score) => sum + score,
        0
      );
      lecturerScores[lecturerId] += totalScore;
    });
  
    // Calculate the grand total
    const grandTotal = Object.values(lecturerScores).reduce(
      (sum:any, score) => sum + score,
      0
    )as any
  
   
    const numberOfLecturers = Object.keys(lecturerScores).length;
  // Calculate the average score per lecturer
  const averageScore = numberOfLecturers > 0 ? grandTotal / numberOfLecturers : 0;
  
   // Output the results
   console.log("Lecturer Scores:", lecturerScores);
   console.log("Grand Total:", grandTotal);
   console.log("averageScore:", averageScore);


    const up=defense+".score"
    console.log("defense",defense)
    const prj=await projectModel.findOneAndUpdate({student_id:element},{
      status:defense.split("_")[0]+"_approved",
      [up]:averageScore
    })
  } 
  }
  
  
  


  
  if (external_examiner) {
    const user = await UserModel.findById(external_examiner);
    sendNotification({
      userdata: user,
      type: "External Examiner",
      message: `You have been assigned External Examiner for ${ses.name}`,
    });
  }
  if (internal_discussants) {
    const user = await UserModel.findById(internal_discussants);
    sendNotification({
      userdata: user,
      type: "Internal Discussant",
      message: `You have been assigned Internal Discussant for ${ses.name}`,
    });
  }
  if (spgs) {
    const user = await UserModel.findById(spgs);
    sendNotification({
      userdata: user,
      type: "SPGS",
      message: `You have been assigned SPGS for ${ses.name}`,
    });
  }

  console.log({
    // external_defense,
    // internal_defense,
    // proposal_defense,
  });
  res.status(201).json(ses);
};

export const setDate = async (req: any, res: any) => {
  const { id, students, external_defense, internal_defense, proposal_defense } =
    req.body;
  let ses = await SessionModel.findByIdAndUpdate(
    id,
    {
      ...req.body,
    },
    { new: true }
  );
  console.log("sse", ses);

  if (internal_defense) {
    let allarr = [] as any;
    const ind1 = await UserModel.findById(ses?.internal_discussants);
    const ind2 = await UserModel.findById(ses?.external_examiner);
    const ind3 = await UserModel.findById(ses?.spgs);
    sendNotification({
      userdata: ind1,
      type: "Date for Internal Defense",
      viewid: ses._id,
      message: `Date for internal defense is set on ${new Date(
        Number(internal_defense?.date)
      ).toDateString()}`,
    });
    sendNotification({
      userdata: ind2,
      type: "Date for Internal Defense",
      viewid: ses._id,

      message: `Date for internal defense is set on ${new Date(
        Number(internal_defense?.date)
      ).toDateString()}`,
    });
    sendNotification({
      userdata: ind3,
      type: "Date for Internal Defense",
      viewid: ses._id,

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

    for (let i = 0; i < usersF.length; i++) {
      const element = usersF[i];
      const usersFmajor = await UserModel.findById(element.supervisors.major);
      const usersFminor = await UserModel.findById(element.supervisors.minor);
      allarr = [...allarr, usersFminor,usersFmajor];
    }
    const users = await UserModel.find({
      _id: { $in: internal_defense.students },
    });
    allarr = [...usersF, ...users];

    for (let i = 0; i < allarr.length; i++) {
      const element = allarr[i];
      sendNotification({
        userdata: element,
        type: "Date for Internal Defense",
        viewid: ses._id,

        message: `Date for internal defense is set on ${new Date(
          Number(internal_defense?.date)
        ).toDateString()}`,
      });
    }

    await projectModel.updateMany(
      { student_id: { $in: internal_defense.students } },
      { $set: { status: "internal_next" } } // specify the fields you want to update here
    );
  }
  if (external_defense) {
    let allarr = [] as any;
    const ind1 = await UserModel.findById(ses?.internal_discussants);
    const ind2 = await UserModel.findById(ses?.external_examiner);
    const ind3 = await UserModel.findById(ses?.spgs);
    sendNotification({
      userdata: ind1,
      type: "Date for Internal Defense",
      viewid: ses._id,
      message: `Date for internal defense is set on ${new Date(
        Number(external_defense?.date)
      ).toDateString()}`,
    });
    sendNotification({
      userdata: ind2,
      type: "Date for Internal Defense",
      viewid: ses._id,
      message: `Date for internal defense is set on ${new Date(
        Number(external_defense?.date)
      ).toDateString()}`,
    });
    sendNotification({
      userdata: ind3,
      type: "Date for Internal Defense",
      viewid: ses._id,
      message: `Date for internal defense is set on ${new Date(
        Number(external_defense?.date)
      ).toDateString()}`,
    });
    const users = await UserModel.find({
      _id: { $in: external_defense?.students },
    });
    const userTypes = [
      "HOD",
      "Provost",
      "Departmental PG Coordinator",
      "Faculty PG Coordinator",
      "Dean",
    ];
    const usersF = await UserModel.find({ type: { $in: userTypes } });
    for (let i = 0; i < usersF.length; i++) {
      const element = usersF[i];
      const usersFmajor = await UserModel.findById(element.supervisors.major);
      const usersFminor = await UserModel.findById(element.supervisors.minor);
      allarr = [...allarr, usersFminor,usersFmajor];
    }
    allarr = [...usersF, ...users];
    for (let i = 0; i < allarr.length; i++) {
      const element = allarr[i];
      sendNotification({
        userdata: element,
        type: "Date for Internal Defense",
        viewid: ses._id,
        message: `Date for internal defense is set on ${new Date(
          Number(external_defense?.date)
        ).toDateString()}`,
      });
    }
    await projectModel.updateMany(
      { student_id: { $in: external_defense?.students } },
      { $set: { status: "external_next" } } // specify the fields you want to update here
    );
  }
  if (proposal_defense) {
    let allarr = [] as any;
    const ind1 = await UserModel.findById(ses?.internal_discussants);
    const ind2 = await UserModel.findById(ses?.external_examiner);
    const ind3 = await UserModel.findById(ses?.spgs);
    sendNotification({
      userdata: ind1,
      viewid: ses._id,
      type: "Date for Proposal Defense",
      message: `Date for proposal defense is set on ${new Date(
        Number(proposal_defense?.date)
      ).toDateString()}`,
    });
    sendNotification({
      userdata: ind2,
      viewid: ses._id,
      type: "Date for Proposal Defense",
      message: `Date for proposal defense is set on ${new Date(
        Number(proposal_defense?.date)
      ).toDateString()}`,
    });
    sendNotification({
      userdata: ind3,
      viewid: ses._id,
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
      _id: { $in: proposal_defense?.students },
    });
    const usersF = await UserModel.find({ type: { $in: userTypes } });
    for (let i = 0; i < usersF.length; i++) {
      const element = usersF[i];
      const usersFmajor = await UserModel.findById(element.supervisors.major);
      const usersFminor = await UserModel.findById(element.supervisors.minor);
      allarr = [...allarr, usersFminor,usersFmajor];
    }
    allarr = [...users, ...usersF];

    console.log("dateddd", ses._id);
    for (let i = 0; i < allarr.length; i++) {
      const element = allarr[i];

      sendNotification({
        userdata: element,
        viewid: ses._id,
        type: "Date for Proposal Defense",
        message: `Date for proposal defense is set on ${new Date(
          Number(proposal_defense?.date)
        ).toDateString()}`,
      });
      await projectModel.updateMany(
        { student_id: { $in: proposal_defense?.students } },
        { $set: { status: "proposal_next" } } // specify the fields you want to update here
      );
    }
  }

  res.status(201).json(ses);
};

export const getsession = async (req: any, res: any) => {
  const { defence, type, spgs, external } = req.query;

  let arrfinal = [] as any[];
  let session = await SessionModel.findById(type);
  let ses = await UserModel.find({ is_student: true, type: session.type });

  const dataq = [] as any[];

  for (let j = 0; j < ses.length; j++) {
    const element = ses[j];
    const projects = await projectModel.findOne({
      student_id: element._id,
      status: defence,
    });

    const data = { ...(await element._doc) };
    data.project = projects;
    console.log(element.projects);
    if (data.project) {
      dataq.push(data);
    }
  }
  arrfinal = [...arrfinal, ...dataq];

  return res.status(200).json([session.type,arrfinal]);
};

export const getsessionMain = async (req: any, res: any) => {
  const { defence, type, id, external } = req.query;

  let arrfinal = [] as any[];

  let ssM = await SessionModel.findById(id)
    .populate("internal_discussants")
    .populate("external_examiner")
    .populate("spgs");
  console.log(
    `ssM.status.split("_")[0]+"_defence"]`,
    ssM.status.split("_")[0] + "_defense"
  );
  let ses = await UserModel.find({
    _id: { $in: ssM[ssM.status.split("_")[0] + "_defense"].students },
  });

  console.log("ssM", ssM);
  const dataq = [] as any[];

  for (let j = 0; j < ses.length; j++) {
    const element = ses[j];
    const projects = await projectModel.findOne({
      student_id: element._id,
      status: ssM.status,
    });

    const data = { ...(await element._doc) };
    data.project = projects;
    console.log(element.projects);
    if (data.project) {
      dataq.push(data);
    }
  }
  arrfinal = [...arrfinal, ...dataq];

  return res.status(200).json([ssM, arrfinal]);
};

export const getSessionName = async (req: any, res: any) => {
  let ssM = await SessionModel.find();

  return res.status(200).json(ssM);
};
export const createSessionName = async (req: any, res: any) => {
  let ssM = await SessionModel.create({ ...req.body });
  return res.status(200).json(ssM);
};
export const DeleteSessionName = async (req: any, res: any) => {
  let ssM = await SessionModel.findByIdAndDelete(req.body.id);
  return res.status(200).json(ssM);
};
export const VoteSheet = async (req: any, res: any) => {
  const body = req.body;
  const id = body.id;
  delete body.id;

  if (id) {
    console.log("update", body);
    const sessionCreated = await VoteModel.findByIdAndUpdate(
      id,
      {
        ...body,
      },
      {
        new: true,
      }
    );
    return res.status(201).json(sessionCreated);
  } else {
    console.log("new", body);
    const sessionCreated = await VoteModel.create({
      ...body,
    });
    body.project = body.project + ".status";
    await projectModel.findByIdAndUpdate(body.project_id, {
      [body.project]: "completed",
    });
    return res.status(201).json(sessionCreated);
  }
};
export const getvoteSheet = async (req: any, res: any) => {
  const sessionCreated = await VoteModel.findOne({ ...req.body });
  return res.status(200).json(sessionCreated);
};

export const scoreSheet = async (req: any, res: any) => {
  const sessionCreated = await scoreSheetModel.create({
    ...req.body,
  });
  return res.status(201).json(sessionCreated);
};

export const getscoreSheet = async (req: any, res: any) => {
  const sessionCreated = await scoreSheetModel.find({ ...req.body });
  return res.status(200).json(sessionCreated);
};

export const deletescore = async (req: any, res: any) => {
  const sessionCreated = await scoreSheetModel.findByIdAndDelete(req.params.id);
  return res.status(200).json(sessionCreated);
};
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
  viewid,
  email,
}: any) => {
  if (userdata) {
    await NotificationModel.create({
      userid: userdata?._id,
      type,
      message,
      viewid,
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
