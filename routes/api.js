'use strict';

const {
  validateProject,
  validateUpdateIssue,
  validateCreateIssue, validateGetIssueFilters, validateDeleteIssue,
} = require('../validators/api.validators.js');

const IssueService = require('../services/issue.service.js');
const {valid} = require('joi');

// TODO: Complete the necessary routes in /routes/api.js
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      let project;
      let filters;
      let result;

      try {
        const validateResults = await Promise.all([
          validateProject(req.params.project),
          validateGetIssueFilters(req.query),
        ]);

        project = validateResults[0];
        filters = validateResults[1];
      } catch (err) {
        console.error(err);
        return res.status(400).send(err.message);
      }

      try {
        result = await IssueService.getIssues(project, filters);
      } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }

      return res.json(result);

    })
    
    .post(async (req, res) => {
      let project;
      let issue;
      let result;

      try {
        const validateResults = await Promise.all([
          validateProject(req.params.project),
          validateCreateIssue(req.body)
        ]);

        project = validateResults[0];
        issue = validateResults[1];
      } catch (err) {
        console.error(err);
        return res.status(400).json({ error: 'required field(s) missing' });
      }

      try {
        result = await IssueService.createIssue(project, issue);
      } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }

      return res.json(result);
    })
    
    .put(async (req, res) => {
      let project;
      let issue;
      let result;

      try {
        const validateResults = await Promise.all([
          validateProject(req.params.project),
          validateUpdateIssue(req.body)
        ]);

        project = validateResults[0];
        issue = validateResults[1];
      } catch (err) {
        return res.status(400).send(err.message);
      }

      try {
        result = await IssueService.updateIssue(project, issue);
      } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }

      // issue: {
      //     _id: '8383849',
      //     issue_title: 'Some new title',
      //     issue_text: 'Some new text',
      //     created_by: 'Bob',
      //     assigned_to: 'Bob',
      //     status_text: 'New status',
      //     open: 'false'
      //   }
      return res.json(result);
      
    })
    
    .delete(async (req, res) => {
      let issue;
      let result;

      try {
        issue = await validateDeleteIssue(req.body);
      } catch (err) {
        return res.status(400).send(err.message);
      }

      // issue: { _id: '8383849' }
      try {
        result = await IssueService.deleteIssue(issue._id);
      } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }

      return res.json(result);
    });

    app.route('/api/issues/:project/delete').get(async (req, res) => {
      let project;
      try {
        project = await validateProject(req.params.project);
      } catch (err) {
        return res.status(400).send(err.message);
      }

      try {
        await IssueService.deleteIssuesByProject(project);
      } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }

      return res.status(200).send('Ok');
    });
    
};
