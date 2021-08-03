'use strict';

const {
  validateProject,
  validateUpdateIssue,
  validateCreateIssue, validateGetIssueFilters, validateDeleteIssue,
} = require('../validators/api.validators.js');

const IssueService = require('../services/issue.service.js');

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
        return res.json({ error: 'required field(s) missing' });
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

      if (req.body._id == null) {
        return res.json({ error: 'missing _id' });
      }

      try {
        const validateResults = await Promise.all([
          validateProject(req.params.project),
          validateUpdateIssue(req.body)
        ]);

        project = validateResults[0];
        issue = validateResults[1];
      } catch (err) {
        return res.json({ error: 'could not update', '_id':  req.body._id});
      }

      if (Object.keys(issue).length === 1) {
        return res.json({ error: 'no update field(s) sent', '_id': issue._id });
      }

      try {
        await IssueService.updateIssue(project, issue);
      } catch (err) {
        console.error(err);
        return res.json({ error: 'could not update', '_id':  issue._id});
      }

      return res.json({ result: 'successfully updated', '_id': issue._id });
    })
    
    .delete(async (req, res) => {
      let issue;

      if (req.body._id == null) {
        return res.json({ error: 'missing _id' });
      }


      try {
        issue = await validateDeleteIssue(req.body);
      } catch (err) {
        return res.json({ error: 'could not delete', '_id': req.body._id });
      }

      try {
        await IssueService.deleteIssue(issue._id);
      } catch (err) {
        console.error(err);
        return res.json({ error: 'could not delete', '_id': issue._id })
      }

      return res.json({ result: 'successfully deleted', '_id': issue._id });
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
