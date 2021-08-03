const IssueModel = require('../models/issue.model.js');

const IssueService = {
  getIssues: async (project, filters) => {
    return await IssueModel.findByProject(project, filters);
  },
  createIssue: async (project, issue) => {
    issue.open = true;
    issue.project = project;

    const newIssue = await IssueModel.create(project, issue);
    delete newIssue.project;

    return newIssue;
  },

  updateIssue: async (project, issue) => {
    return await IssueModel.updateById(project, issue);
  },
  deleteIssue: async (project, _id) => {
    return await IssueModel.deleteById(project, _id);
  },

  deleteIssuesByProject: async (project) => {
    return await IssueModel.deleteByProject(project);
  }
};

module.exports = IssueService;
