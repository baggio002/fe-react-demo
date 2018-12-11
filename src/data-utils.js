

export function fetchList(isTeamPage, callback) {
    let url = isTeamPage ? "http://tempo-test.herokuapp.com/7d1d085e-dbee-4483-aa29-ca033ccae1e4/1/team/"
        : "http://tempo-test.herokuapp.com/7d1d085e-dbee-4483-aa29-ca033ccae1e4/1/user/"
    fetch(url, {mode: 'cors'})
        .then(res =>
            res.json())
        .then(
            (res) => {
                console.log("res = " + res[0][0]);
                if (callback != null) {
                    callback(res,
                        {isLoaded: true});
                }
            },
            (error) => {
                if (callback != null) {
                    callback([],
                        {
                            isLoaded: true,
                            error: error
                        });
                }
            })
}

export function fetchTeam(teamId, callback) {
    fetch("http://tempo-test.herokuapp.com/7d1d085e-dbee-4483-aa29-ca033ccae1e4/1/team/" + teamId, {mode: 'cors'})
        .then(res =>
            res.json())
        .then(
            (res) => {
                if (callback != null) {
                    callback(res, {
                        isLoaded: true
                    });
                }
            },
            (error) => {
                if (callback != null) {
                    callback({}, {
                        isLoaded: true,
                        error
                    })
                }
            })
}

export function fetchMember(memberId, callback) {
    fetch("http://tempo-test.herokuapp.com/7d1d085e-dbee-4483-aa29-ca033ccae1e4/1/user/" + memberId, {mode: 'cors'})
        .then(res =>
            res.json())
        .then(
            (res) => {
                if (callback != null) {
                    callback(res, {
                        isLoaded: true
                    });
                }
            },
            (error) => {
                if (callback != null) {
                    callback({}, {
                        isLoaded: true,
                        error
                    })
                }
            })
}