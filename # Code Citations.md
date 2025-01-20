# Code Citations

## License: unknown
https://github.com/krumiprog/mern_auth_jwt/tree/c2b91f06d030c6b75e732908d072a9bab38f5f43/server/src/controllers/UserController.js

```
const loginUser  = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
```


## License: unknown
https://github.com/AvishkaShyaman/fuel-service/tree/3560c66b1a194c95fa6e8e13ddb1e99462ee9c76/controllers/auth.controller.js

```
, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ status: false, message:
```


## License: unknown
https://github.com/amirSA5/fw/tree/ac137946bc262f6eb3b3f27c7de010a903d30264/server/controllers/usersController.js

```
});
    }
};

const loginUser  = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(
```


## License: unknown
https://github.com/YONK17544/bootcamp-1/tree/9db34aafb4f619d99d406ee7f09a7537c52c3d92/controllers/user.controller.js

```
=> {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ status: false, message: "Invalid email
```

