const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const IssueService = require('../services/issue.service.js');

chai.use(chaiHttp);

// TODO: Create all of the functional tests in tests/2_functional-tests.js
suite('Functional Tests', () => {
  const project = 'test_project';
  const createdIssues = [];

  // Create an issue with every field: POST request to /api/issues/{project}
  test('Create an issue with every field', (done) => {
    const issue = {
      issue_title: 'Implement tests logic',
      issue_text: 'Add functional tests',
      created_by: 'John Doe',
      assigned_to: 'John Doe',
      status_text: 'created',
    };

    chai.request(server)
      .post(`/api/issues/${project}`)
      .send(issue)
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.strictEqual(res.body.open, true);
        assert.strictEqual(res.body.issue_title, issue.issue_title);
        assert.strictEqual(res.body.issue_text, issue.issue_text);
        assert.strictEqual(res.body.created_by, issue.created_by);
        assert.strictEqual(res.body.assigned_to, issue.assigned_to);
        assert.strictEqual(res.body.status_text, issue.status_text);
        assert.strictEqual(res.body.open, true);
        assert.isString(res.body._id);
        assert.isString(res.body.created_on);
        assert.isNotNaN(Date.parse(res.body.created_on));
        assert.isString(res.body.updated_on);
        assert.isNotNaN(Date.parse(res.body.updated_on));

        createdIssues.push(res.body);

        done();
      });
  });

  // Create an issue with only required fields: POST request to /api/issues/{project}
  test('Create an issue with only required fields', (done) => {
    const issue = {
      issue_title: 'Add additional tests logic',
      issue_text: 'Add api update tests',
      created_by: 'John Doe',
    };

    chai.request(server)
      .post(`/api/issues/${project}`)
      .send(issue)
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.strictEqual(res.body.open, true);
        assert.strictEqual(res.body.issue_title, issue.issue_title);
        assert.strictEqual(res.body.issue_text, issue.issue_text);
        assert.strictEqual(res.body.created_by, issue.created_by);
        assert.isString(res.body.assigned_to);
        assert.isString(res.body.status_text);
        assert.strictEqual(res.body.open, true);
        assert.isString(res.body._id);
        assert.isString(res.body.created_on);
        assert.isNotNaN(Date.parse(res.body.created_on));
        assert.isString(res.body.updated_on);
        assert.isNotNaN(Date.parse(res.body.updated_on));

        createdIssues.push(res.body);

        done();
      });
  });

  // Create an issue with missing required fields: POST request to /api/issues/{project}
  test('Create an issue with missing required fields', (done) => {
    const issue = {
      issue_title: 'Invalid create issue request',
      issue_text: 'Some relevant text',
    };

    chai.request(server)
      .post(`/api/issues/${project}`)
      .send(issue)
      .end((err, res) => {
        assert.strictEqual(res.status, 400);
        assert.strictEqual(res.type, 'text/html');
        done();
      });
  });

  // View issues on a project: GET request to /api/issues/{project}
  test('View issues on a project', (done) => {
    chai.request(server)
      .get(`/api/issues/${project}`)
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.isArray(res.body);
        assert.strictEqual(res.body.length, 2);
        assert.deepStrictEqual(res.body, createdIssues);
        done();
      });
  });

  // View issues on a project with one filter: GET request to /api/issues/{project}
  // View issues on a project with multiple filters: GET request to /api/issues/{project}
  // Update one field on an issue: PUT request to /api/issues/{project}

  // Update multiple fields on an issue: PUT request to /api/issues/{project}
  // Update an issue with missing _id: PUT request to /api/issues/{project}
  // Update an issue with no fields to update: PUT request to /api/issues/{project}
  // Update an issue with an invalid _id: PUT request to /api/issues/{project}
  // Delete an issue: DELETE request to /api/issues/{project}
  // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
  // Delete an issue with missing _id: DELETE request to /api/issues/{project}

  after((done) => {
    IssueService.deleteIssuesByProject(project).then(done);
  });
});
