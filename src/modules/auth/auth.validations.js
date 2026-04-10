import Joi from "joi";

const validate = (body) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(5).required(),
  });

  return schema.validate(body);
};

export default validate;
