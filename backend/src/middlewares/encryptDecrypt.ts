import { encrypt, decrypt } from "../utils/encryption";

export const decryptRequestMiddleware = async (
  req: any,
  res: any,
  next: any
) => {
  if (req.body && Object.keys(req.body).length > 0) {
    if (req.body.encryptedData) {
      try {
        const decryptedData = await decrypt(req.body.encryptedData);

        // sometimes its a string sometimes its already an object
        if (typeof decryptedData.data === "string") {
          req.body = JSON.parse(decryptedData.data);
        } else {
          req.body = decryptedData.data;
        }
      } catch (error) {
        return res.status(400).json({ message: "Invalid encrypted data." });
      }
      next();
    } else {
      return res.status(400).json({ message: "Invalid data." });
    }
  } else {
    next();
  }
};

export const encryptResponseMiddleware = (req: any, res: any, next: any) => {
  const originalSend = res.send;

  res.send = async function (body: any) {
    try {
      const responseBody = JSON.parse(body);
      if (responseBody.data) {
        const encryptedData = await encrypt({ data: responseBody.data });
        responseBody.encryptedData = encryptedData;
        delete responseBody.data;
        originalSend.call(this, JSON.stringify(responseBody));
      } else {
        originalSend.call(this, body);
      }
    } catch (error) {
      console.error("Encryption error:", error);
      originalSend.call(
        this,
        JSON.stringify({ message: "Encryption failed." })
      );
    }
  };

  next();
};
