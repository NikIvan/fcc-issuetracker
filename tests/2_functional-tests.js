const chaiHttp = require('chai-http');
const chai = require('chai');
const {assert, expect} = chai;
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
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.strictEqual(res.body.error, 'required field(s) missing');

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
  test('View issues on a project with one filter', (done) => {
    chai.request(server)
      .get(`/api/issues/${project}?issue_title=${createdIssues[0].issue_title}`)
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.isArray(res.body);
        assert.strictEqual(res.body.length, 1);
        assert.deepStrictEqual(res.body[0], createdIssues[0]);
        done();
      });
  });

  // View issues on a project with multiple filters: GET request to /api/issues/{project}
  test('View issues on a project with one filter', (done) => {
    chai.request(server)
      .get(`/api/issues/${project}?issue_title=${createdIssues[0].issue_title}&open=true`)
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.isArray(res.body);
        assert.strictEqual(res.body.length, 1);
        assert.deepStrictEqual(res.body[0], createdIssues[0]);
        done();
      });
  });

  // Update one field on an issue: PUT request to /api/issues/{project}
  test('Update one field on an issue', (done) => {
    const {_id} = createdIssues[0];

    const dataToUpdate = {
      issue_title: 'Some very merry new title',
      _id,
    };

    chai.request(server)
      .put(`/api/issues/${project}`)
      .send(dataToUpdate)
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.strictEqual(res.body.result, 'successfully updated');
        assert.strictEqual(res.body._id, _id);

        done();
      });
  });

  // Update multiple fields on an issue: PUT request to /api/issues/{project}
  test('Update multiple fields on an issue', (done) => {
    const {_id} = createdIssues[0];

    const dataToUpdate = {
      issue_title: 'Some new very merry new title',
      issue_text: 'Some issue updated new text',
      _id,
    };

    chai.request(server)
      .put(`/api/issues/${project}`)
      .send(dataToUpdate)
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.strictEqual(res.body.result, 'successfully updated');
        assert.strictEqual(res.body._id, _id);

        done();
      });
  });

  // Update an issue with missing _id: PUT request to /api/issues/{project}
  test('Update an issue with missing _id', (done) => {
    const dataToUpdate = {
      issue_title: 'Some new very merry new title',
      issue_text: 'Some issue updated new text',
    };

    chai.request(server)
      .put(`/api/issues/${project}`)
      .send(dataToUpdate)
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.strictEqual(res.body.error, 'missing _id');

        done();
      });
  });

  // Update an issue with no fields to update: PUT request to /api/issues/{project}
  test('Update an issue with no fields to update', (done) => {
    const {_id} = createdIssues[0];

    chai.request(server)
      .put(`/api/issues/${project}`)
      .send({_id})
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.strictEqual(res.body.error, 'no update field(s) sent');
        assert.strictEqual(res.body._id, _id);

        done();
      });
  });

  // Update an issue with an invalid _id: PUT request to /api/issues/{project}
  test('Update an issue with an invalid _id', (done) => {
    const _id = 'some invalid id';

    chai.request(server)
      .put(`/api/issues/${project}`)
      .send({_id})
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.strictEqual(res.body.error, 'could not update');
        assert.strictEqual(res.body._id, _id);

        done();
      });
  });

  // Delete an issue: DELETE request to /api/issues/{project}
  test('Delete an issue', (done) => {
    const {_id} = createdIssues.pop();

    chai.request(server)
      .delete(`/api/issues/${project}`)
      .send({_id})
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        assert.strictEqual(res.body.result, 'successfully deleted');
        assert.strictEqual(res.body._id, _id);

        done();
      });
  });

  // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
  test('Delete an issue with an invalid _id', (done) => {
    const _id = 'invalid id';

    chai.request(server)
      .delete(`/api/issues/${project}`)
      .send({_id})
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        expect(res.body).to.have.all.keys('error', '_id');
        assert.deepStrictEqual(res.body.error, 'could not delete');
        assert.deepStrictEqual(res.body._id, _id);

        done();
      });
  });

  // Delete an issue with missing _id: DELETE request to /api/issues/{project}
  test('Delete an issue with missing _id', (done) => {

    chai.request(server)
      .delete(`/api/issues/${project}`)
      .send({})
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.type, 'application/json');
        expect(res.body).to.have.all.keys('error');
        assert.deepStrictEqual(res.body.error, 'missing _id');

        done();
      });
  });

  after((done) => {
    IssueService.deleteIssuesByProject(project).then(done);
  });
});
