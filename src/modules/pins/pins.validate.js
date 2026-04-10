import Joi from "joi";

export const createValidate = (body) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    body: Joi.string().min(3).required(),
    image_link: Joi.string().required(),
  });

  return schema.validate(body);
};

export const updateValidate = (body) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    body: Joi.string().min(3).optional(),
    image_link: Joi.string().optional(),
  });

  return schema.validate(body);
};
