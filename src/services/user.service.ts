import Web3 from "web3";
import UserModel from "../models/user.model";
import {
  CommentModel,
  DocumentTokenModel,
  projectModel,
  SessionModel,
} from "../models/schema.model";

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

  return res.status(201).json(sessionCreated);
};
export const getStudentProject = async (req: any, res: any) => {
 
  let data
  if( req.query.id){
    data = await projectModel.find({student_id: req.query.id});
  }else{
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
  return res.status(200).json(data);
};

export const addDocument = async (req: any, res: any) => {
  console.log(req.body);
 
 const added= await DocumentTokenModel.create({
    ...req.body,
    project_id: req.params.id,
  });

  return res.status(201).json(added);
};

export const getStsupervisorProjectStudentudentProject = async (req: any, res: any) => {
  console.log(req.body);
 const {lecturer_id,}=req.query
 const added= await UserModel.find( {
  $or: [
    { "supervisors.major": lecturer_id },
    { "supervisors.minor": lecturer_id}
]
});
const dataq=[] as any[]

for (let i = 0; i < added.length; i++) {
  const element = added[i];
  const projects= await projectModel.find({
    student_id:element._id
     })
     
     const data={...await element._doc}
     data.project=projects[projects.length-1]
     console.log(element.project)

     dataq.push(data)
}

  return res.status(201).json(dataq);
};