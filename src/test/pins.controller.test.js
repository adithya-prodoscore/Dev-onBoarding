import { describe, jest } from "@jest/globals";

// Mocks Must Define Before Imports (Important)
const mockQuery = jest.fn();
const mockCreateValidate = jest.fn();
const mockUpdateValidate = jest.fn();

jest.unstable_mockModule("../shared/database/db.js", () => ({
  default: {
    query: mockQuery,
  },
}));

jest.unstable_mockModule("../modules/pins/pins.validate.js", () => ({
  createValidate: mockCreateValidate,
  updateValidate: mockUpdateValidate,
}));

// Now Include Imports (Hoisting issue)
const { createPin, getPins, getPinById, updatePin, deletePin } =
  await import("../modules/pins/pins.controller.js");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe("createPin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if invalid body", async () => {
    mockCreateValidate.mockReturnValue({
      error: { details: [{ message: "Invalid" }] },
    });

    const req = { body: {}, user: { userId: 1 } };
    const res = mockResponse();

    await createPin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should create pin and return 201", async () => {
    mockCreateValidate.mockReturnValue({
      error: null,
      value: {
        title: "this is title",
        body: "this is body",
        image_link: "this is link",
      },
    });

    mockQuery.mockResolvedValue([{ insertId: 1 }]);

    const req = {
      body: { title: "t", body: "b", image_link: "i" },
      user: { userId: 1 },
    };

    const res = mockResponse();

    await createPin(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});

// describe("getPins", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it("should return all pins with 200", async () => {
//     const mockRows = [
//       { id: 1, title: "Pin 1", author: "user1" },
//       { id: 2, title: "Pin 2", author: "user2" },
//     ];

//     mockQuery.mockResolvedValue([mockRows]);

//     const req = {};
//     const res = mockResponse();

//     await getPins(req, res);

//     expect(mockQuery).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith(mockRows);
//   });
// });

describe("getPinById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 for invalid id", async () => {
    const req = { params: { id: "abc" } };
    const res = mockResponse();

    await getPinById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 404 if pin not found", async () => {
    mockQuery.mockResolvedValue([[]]);

    const req = { params: { id: 1 } };
    const res = mockResponse();

    await getPinById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return pin with 200", async () => {
    const mockPin = { id: 1, title: "Pin 1", author: "user1" };

    mockQuery.mockResolvedValue([[mockPin]]);

    const req = { params: { id: 1 } };
    const res = mockResponse();

    await getPinById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockPin);
  });
});

describe("updatePin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if validation fails", async () => {
    mockUpdateValidate.mockReturnValue({
      error: { details: [{ message: "Invalid" }] },
    });

    const req = { body: {}, params: { id: 1 } };
    const res = mockResponse();

    await updatePin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 for invalid id", async () => {
    mockUpdateValidate.mockReturnValue({ error: null, value: {} });

    const req = { body: {}, params: { id: "abc" } };
    const res = mockResponse();

    await updatePin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 404 if pin not found", async () => {
    mockUpdateValidate.mockReturnValue({
      error: null,
      value: { title: "t" },
    });

    mockQuery.mockResolvedValue([{ affectedRows: 0 }]);

    const req = { body: { title: "t" }, params: { id: 1 } };
    const res = mockResponse();

    await updatePin(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should update pin and return 200", async () => {
    mockUpdateValidate.mockReturnValue({
      error: null,
      value: { title: "t", body: "b", image_link: "i" },
    });

    mockQuery.mockResolvedValue([{ affectedRows: 1 }]);

    const req = {
      body: { title: "t", body: "b", image_link: "i" },
      params: { id: 1 },
    };

    const res = mockResponse();

    await updatePin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Pin updated successfully",
    });
  });
});

describe("deletePin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 for invalid id", async () => {
    const req = { params: { id: "abc" } };
    const res = mockResponse();

    await deletePin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 404 if pin not found", async () => {
    mockQuery.mockResolvedValue([{ affectedRows: 0 }]);

    const req = { params: { id: 1 } };
    const res = mockResponse();

    await deletePin(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should delete pin and return success message", async () => {
    mockQuery.mockResolvedValue([{ affectedRows: 1 }]);

    const req = { params: { id: 1 } };
    const res = mockResponse();

    await deletePin(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Pin deleted successfully",
    });
  });
});
