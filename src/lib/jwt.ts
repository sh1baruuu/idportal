import * as jwt from "jsonwebtoken";

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY ;

if (!privateKey) {
    throw new Error("PRIVATE_KEY environment variable is not set");
}

export const jwtSign = (payload: object): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, privateKey, (err, token) => {
            if (err || !token) {
                return reject(err?.message || "Unknown error");
            }
            resolve(token);
        });
    });
};

export const jwtVerify = (token: string): Promise<jwt.JwtPayload | string> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, privateKey, { ignoreExpiration: true }, (err, decoded) => {
            if (err || !decoded) {
                return reject(err?.message || "Unknown error");
            }
            resolve(decoded);
        });
    });
};
