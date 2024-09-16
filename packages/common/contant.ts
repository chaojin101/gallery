export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 20;

export const GALLERY_NAME_MIN_LENGTH = 1;
export const GALLERY_NAME_MAX_LENGTH = 100;
export const GALLERY_DESCRIPTION_MIN_LENGTH = 0;
export const GALLERY_DESCRIPTION_MAX_LENGTH = 300;

export const COLLECTION_NAME_MIN_LENGTH = 1;
export const COLLECTION_NAME_MAX_LENGTH = 100;
export const COLLECTION_DESCRIPTION_MIN_LENGTH = 0;
export const COLLECTION_DESCRIPTION_MAX_LENGTH = 300;

// auth
export const MSG_UNAUTHENTICATED = "Unauthenticated";
export const MSG_UNAUTHORIZED = "Unauthorized";

// POST /api/v1/user/sign-up
export const MSG_EMAIL_EXISTS = "Email already exists";

// POST /api/v1/user/sign-in
export const MSG_INVALID_EMAIL_OR_PASSWORD = "Invalid email or password";

// POST /api/v1/galleries
export const MSG_GALLERY_NAME_EXIST = "Gallery name already exists";

// POST /api/v1/galleries/:galleryId/append
export const MSG_GALLERY_NOT_FOUND = "Gallery not found";

// POST /api/v1/collections
export const MSG_COLLECTION_NAME_EXIST = "collection name already exists";

export const MSG_COLLECTION_NOT_FOUND = "Collection not found";
