export declare const jwtConfig: {
    access: {
        secret: string;
        expiresIn: string | number;
    };
    refresh: {
        secret: string;
        expiresIn: string | number;
    };
};
export declare const refreshTokenCookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict";
    maxAge: number;
};
//# sourceMappingURL=jwt.d.ts.map