export const constants = {
    "EMAIL_INVALID" : "* 올바른 이메일 주 형식을 입력해주세요. \n (예: example@example.com)",
    "PASSWORD_BLANK" : "* 비밀번호를 입력해주세요",
    "PASSWORD_INVALID" : "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 특수문자를 각각 최소 1개 포함해야 합니다.",
}

export const regex ={
    "EMAIL": /^[A-Za-z0-9@._-]+$/,
    "PASSWORD": /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
}