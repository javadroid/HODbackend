import { Schema, model, models } from "mongoose";

const projectSchema = new Schema(
  {
    name: String,
    status: String,
    type: String,
    student_id: {
      type: String,
      ref: "UserModel",
    },
    session_id: {
      type: String,
      ref: "SessionModel",
    },
    proposal_defense: {
      status: String,
      date: String,
      vote_id: {
        type: String,
        ref: "VoteModel",
      },
    },
    internal_defense: {
      status: String,
      date: String,
      vote_id: {
        type: String,
        ref: "VoteModel",
      },
    },
    external_defense: {
      status: String,
      date: String,
      vote_id: {
        type: String,
        ref: "ScoreModel",
      },
    },
    seminar3: {
      date: String,
      status: String,
      vote_id: {
        type: String,
        ref: "VoteModel",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const projectModel =
  models.projectModel || model("projectModel", projectSchema);

const documentSchema = new Schema(
  {
    project_id: String,
    url: String,
  },
  {
    timestamps: true,
  }
);

export const DocumentTokenModel =
  models.DocumentTokenModel || model("DocumentTokenModel", documentSchema);

const commentSchema = new Schema(
  {
    document_id: String,
    project_id: String,
    lecturer_id: {
      type: String,
      ref: "UserModel",
    },
    comment: String,
  },
  {
    timestamps: true,
  }
);

export const CommentModel =
  models.CommentModel || model("CommentModel", commentSchema);

const sessionSchema = new Schema(
  {
    session: String,
    batch:String,
    type:String,
    internal_discussants:{
      type: String,
      ref: "UserModel",
    },

    spgs:{
      type: String,
      ref: "UserModel",
    },
    external_examiner:{
      type: String,
      ref: "UserModel",
    },
    proposal_defense: {
      status: String,
      date: String,
      vote_id: {
        type: String,
        ref: "VoteModel",
      },
    },
    internal_defense: {
      status: String,
      date: String,
      vote_id: {
        type: String,
        ref: "VoteModel",
      },
    },
    external_defense: {
      status: String,
      date: String,
      vote_id: {
        type: String,
        ref: "ScoreModel",
      },
    },
    seminar3: {
      date: String,
      status: String,
      vote_id: {
        type: String,
        ref: "VoteModel",
      },
    },

  },
  {
    timestamps: true,
  }
);

export const SessionModel =
  models.SessionModel || model("SessionModel", sessionSchema);

const setSchema = new Schema(
  {
    name: String,
    session_id: {
      type: String,
      ref: "SessionModel",
    },
  },
  {
    timestamps: true,
  }
);

export const SetModel = models.SetModel || model("SetModel", setSchema);

const voteSchema = new Schema(
  {
    panel: [
      {
        staff: {
          type: String,
          ref: "UserModel",
        },
        vote: Boolean,
      },
    ],
    session_id: {
      type: String,
      ref: "SessionModel",
    },
    set_id: {
      type: String,
      ref: "SetModel",
    },
  },
  {
    timestamps: true,
  }
);

export const VoteModel = models.VoteModel || model("VoteModel", voteSchema);
