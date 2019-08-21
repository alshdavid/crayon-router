export default {
    "test-a": [
        {
            "type": "ROUTER_LOAD_TRIGGERED",
            "id": "router-a",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_START",
            "id": "router-a",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_RUNNING_HANDLERS",
            "id": "router-a",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_LOAD_TRIGGERED",
            "id": "router-b",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_START",
            "id": "router-b",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_RUNNING_HANDLERS",
            "id": "router-b",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_LOAD_TRIGGERED",
            "id": "router-c",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_START",
            "id": "router-c",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_RUNNING_HANDLERS",
            "id": "router-c",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_END",
            "id": "router-a",
            "data": {
                "path": "/a/a/a",
                "note": "handlers have completed running",
                "route": "/a/**"
            }
        },
        {
            "type": "ROUTER_END",
            "id": "router-b",
            "data": {
                "path": "/a/a/a",
                "note": "handlers have completed running",
                "route": "/a/a/**"
            }
        },
        {
            "type": "ROUTER_END",
            "id": "router-c",
            "data": {
                "path": "/a/a/a",
                "note": "handlers have completed running",
                "route": "/a/a/a"
            }
        },
        {
            "type": "HISTORY_EVENT",
            "id": "router-a",
            "data": {
                "type": "PUSH",
                "from": "/a/a/a",
                "to": "/a/static"
            }
        },
        {
            "type": "ROUTER_START",
            "id": "router-a",
            "data": "/a/static"
        },
        {
            "type": "ROUTER_DESTROYED",
            "id": "router-c",
            "data": "/a/static"
        },
        {
            "type": "ROUTER_DESTROYED",
            "id": "router-b",
            "data": "/a/static"
        },
        {
            "type": "ROUTER_RUNNING_HANDLERS",
            "id": "router-a",
            "data": "/a/static"
        },
        {
            "type": "ROUTER_END",
            "id": "router-a",
            "data": {
                "path": "/a/static",
                "note": "handlers have completed running",
                "route": "/a/static"
            }
        },
        {
            "type": "HISTORY_EVENT",
            "id": "router-a",
            "data": {
                "type": "PUSH",
                "from": "/a/static",
                "to": "/a/a/a"
            }
        },
        {
            "type": "ROUTER_START",
            "id": "router-a",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_RUNNING_HANDLERS",
            "id": "router-a",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_LOAD_TRIGGERED",
            "id": "router-b",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_START",
            "id": "router-b",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_RUNNING_HANDLERS",
            "id": "router-b",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_LOAD_TRIGGERED",
            "id": "router-c",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_START",
            "id": "router-c",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_RUNNING_HANDLERS",
            "id": "router-c",
            "data": "/a/a/a"
        },
        {
            "type": "ROUTER_END",
            "id": "router-a",
            "data": {
                "path": "/a/a/a",
                "note": "handlers have completed running",
                "route": "/a/**"
            }
        },
        {
            "type": "ROUTER_END",
            "id": "router-b",
            "data": {
                "path": "/a/a/a",
                "note": "handlers have completed running",
                "route": "/a/a/**"
            }
        },
        {
            "type": "ROUTER_END",
            "id": "router-c",
            "data": {
                "path": "/a/a/a",
                "note": "handlers have completed running",
                "route": "/a/a/a"
            }
        }
    ]
}