const mongoose = require('mongoose');
const {Schema} = mongoose;

const issueSchema = new Schema({
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
  },
  open: {
    type: Boolean,
    default: true,
  },
  status_text: {
    type: String,
  },
  project: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
  updated_on: {
    type: Date,
    default: Date.now,
  },
});

let Issue;

const IssueModel = {
  init: (connection) => {
    Issue = connection.model('issue', issueSchema);
  },

  create: async (project, issue) => {
    const {
      issue_title,
      issue_text,
      created_by,
      assigned_to,
      status_text,
    } = issue;

    const issueData = {
      issue_title,
      issue_text,
      created_by,
      project,
    };

    if (assigned_to != null) {
      issueData.assigned_to = assigned_to;
    }

    if (assigned_to != null) {
      issueData.status_text = status_text;
    }

    const result = new Issue(issueData);

    try {
      await result.save();
    } catch (err) {
      console.error(err);
      throw new Error('Cannot create issue');
    }

    return result.toObject({ versionKey: false });
  },

  findByProject: async (project, filters) => {
    let issues;
    let query = Issue.find({project}, { project: 0, __v: 0 }).lean();

    // const {from, to, limit} = filters;
    //
    // if (from != null) {
    //   query.where('date').gte(new Date(from));
    // }
    //
    // if (to != null) {
    //   query.where('date').lte(new Date(to));
    // }
    //
    // if (limit != null) {
    //   query.limit(limit);
    // }
    //
    //

    try {
      issues = await query;
    } catch(err) {
      console.error(err);
      throw new Error('Cannot find issues by project name');
    }

    return issues;
  },

  updateById: async (_id, issueInput) => {
    let result;

    const setObject = {};

    [
      'issue_title',
      'issue_text',
      'created_by',
      'assigned_to',
      'status_text',
      'open',
    ].filter((key) => issueInput[key] != null)
      .forEach((key) => setObject[key] = issueInput[key]);

    let query = Issue.findOneAndUpdate({_id}, {
      $set: setObject,
    }).lean();

    try {
      result = await query;
    } catch (err) {
      console.error(err);
      throw new Error('Cannot update issue by id');
    }

    return result;
  },

  deleteById: async (_id) => {
    let query = Issue.deleteOne({_id});

    try {
      await query;
    } catch (err) {
      console.error(err);
      throw new Error('Cannot delete issue by id');
    }
  },

  deleteByProject: async (project) => {
    let query = Issue.deleteMany({project});


    try {
      await query;
    } catch (err) {
      console.error(err);
      throw new Error('Cannot delete issues by project');
    }
  }
};

module.exports = IssueModel;
