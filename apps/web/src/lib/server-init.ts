export const serverInit = () => {
  setupEnv();
};

const setupEnv = () => {
  if (!process.env.NEXT_PUBLIC_BACKEND_HOST) {
    throw Error(
      "Please set the `BACKEND_HOST` variable in the `.env` file to connect to the backend service. Refer to the `.env.example` file for guidance."
    );
  }
};
