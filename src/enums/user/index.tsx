import {type UserId } from "@/types";
const USER = {
    SAM: 'Sam',
    RUSSELL: 'Russell',
    JOYSE: 'Joyse'
 }as const

const USER_LIST: UserId[] = [USER.SAM, USER.RUSSELL, USER.JOYSE] 

export {
    USER,
    USER_LIST
}