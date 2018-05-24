import { resourcesReducer, INITIAL_STATE } from '../../reducers/resources'
import { SYNC_REDUCER_WITH_DB } from '../../actions/types'

describe("resources reducer", () => {
    it("should return the initial state", () => {
        expect(resourcesReducer(undefined, {})).toEqual(INITIAL_STATE)
    })

    it("should handle sync db resources", () => {
        const mock_resources = {
            boards: [{
                _id: "boards_id_1",
                comments: ["reply_id_1"]
            }],
            users: [{
                _id: "user_id_1",
                avatar: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
                email: "user1@example.com"
            }],
            replies: [{
                _id: "reply_id_1",
                from: "user_id_1",
                to: "boards_id_1",
                content: "1th",
                date: 1526726590000
            }]
        }
        expect(resourcesReducer(undefined, {
            type: SYNC_REDUCER_WITH_DB,
            resources: mock_resources
        })).toEqual(mock_resources)
    })
})