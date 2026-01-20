export declare const jwtConfig: {
    access: {
        secret: string;
        expiresIn: string;
    };
    refresh: {
        secret: string;
        expiresIn: string;
    };
};
export declare const refreshTokenCookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict";
    maxAge: number;
};
//# sourceMappingURL=jwt.d.ts.map