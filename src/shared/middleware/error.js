export const error = (err, req, res, next) => {
  console.error(err);

  return res.status(500).json({
    message: "Something went wrong",
  });
};
