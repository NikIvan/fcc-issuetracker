const Joi = require('joi');

const validate = (schema) => async (input) => await schema.validateAsync(input);

const getIssueFiltersSchema = Joi.object({
  _id: Joi.string(),
  issue_title: Joi.string(),
  issue_text: Joi.string(),
  created_on: Joi.date(),
  updated_on: Joi.date(),
  created_by: Joi.string(),
  assigned_to: Joi.string(),
  open: Joi.boolean(),
  status_text: Joi.string(),
});
const validateGetIssueFilters = validate(getIssueFiltersSchema);

const createIssueSchema = Joi.object({
  issue_title: Joi.string().required(),
  issue_text: Joi.string().required(),
  created_by: Joi.string().required(),
  assigned_to: Joi.string().allow('').default(''),
  status_text: Joi.string().allow('').default(''),
});
const validateCreateIssue = validate(createIssueSchema);

const updateIssueSchema = Joi.object({
  _id: Joi.string().required(),
  issue_title: Joi.string().allow(''),
  issue_text: Joi.string().allow(''),
  created_by: Joi.string().allow(''),
  assigned_to: Joi.string().allow(''),
  open: Joi.boolean(),
  status_text: Joi.string().allow(''),
});
const validateUpdateIssue = validate(updateIssueSchema);

const deleteIssueSchema = Joi.object({
  _id: Joi.string().required(),
});
const validateDeleteIssue = validate(deleteIssueSchema);

const projectSchema = Joi.string();
const validateProject = validate(projectSchema);

module.exports = {
  validateGetIssueFilters,
  validateCreateIssue,
  validateUpdateIssue,
  validateDeleteIssue,
  validateProject,
};
