import { jest } from "@jest/globals";

export const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  res.cookie = jest.fn();
  res.sendStatus = jest.fn();
  return res;
};
