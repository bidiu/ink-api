let customCodeDef = Object.freeze({
    'USER_TO_GUEST': 40001,         // login into guest directly from a regular user

    'WRONG_CREDENTIAL': 40101,      // user gave wrong login credential (might be email or password)
    'WRONG_PASSWD': 40102,          // user gave wrong password
    'NONEXIST_ACCOUNT': 40103       // username or email doesn't exist
});

module.exports = customCodeDef;
