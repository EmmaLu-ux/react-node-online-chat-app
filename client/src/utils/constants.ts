export const HOST = import.meta.env.VITE_SERVER_URL

// 授权相关路由
export const AUTH_ROUTES = "api/auth"
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`
export const UPDATE_PROFILE = `${AUTH_ROUTES}/update-profile`
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/add-profile-image`
export const REMOVE_PROFILE_IMAGE = `${AUTH_ROUTES}/remove-profile-image`
export const LOGOUT = `${AUTH_ROUTES}/logout`

// 联系人相关路由
export const CONTACTS_ROUTES = "api/contacts"
export const SEARCH_CONTACTS = `${CONTACTS_ROUTES}/search`
export const GET_CONTACTS_FOR_DM_LIST = `${CONTACTS_ROUTES}/get-contacts-for-dm`
export const GET_ALL_CONTACTS = `${CONTACTS_ROUTES}/get-all-contacts`

// 消息相关路由
export const MESSAGES_ROUTES = "api/messages"
export const GET_ALL_MESSAGES = `${MESSAGES_ROUTES}/get-messages`
export const UPLOAD_FILE = `${MESSAGES_ROUTES}/upload-file`

// 群聊相关路由
export const GROUPS_ROUTES = "api/groups"
export const CREATE_GROUP = `${GROUPS_ROUTES}/create-group`
export const GET_USER_GROUPS = `${GROUPS_ROUTES}/get-user-groups`
export const GET_GROUP_MESSAGES = `${GROUPS_ROUTES}/get-group-messages`
