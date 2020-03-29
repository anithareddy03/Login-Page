export function configureFakeBackend() {
    let users = [
        { 
            username: 'hruday@gmail.com', 
            password: 'hruday123'
        },
        {
            "id": 1,
            "name":"test1",        
            "age" : "11",        
            "gender":"male",       
            "email" : "test1@gmail.com",       
            "phoneNo" : "9415346313" 
        },
        {
            "id": 2,
            "name":"test2",        
            "age" : "12",       
            "gender":"male",        
            "email" : "test2@gmail.com",        
            "phoneNo" : "9415346314"  
       },
       {
        "id":3,        
        "name":"test3", 
        "age" : "13",        
        "gender":"male",        
        "email" : "test3@gmail.com",        
        "phoneNo" : "9415346315"   
      },
      {
        "id":4,        
        "name":"test4",        
        "age" : "14",        
        "gender":"male",        
        "email" : "test4@gmail.com",       
        "phoneNo" : "9415346316"   
      },
      {
        "id":5,        
        "name":"test5",       
        "age" : "15",        
        "gender":"male",        
        "email" : "test5@gmail.com",        
        "phoneNo" : "9415346317" 
      },
      {
        "id":6,        
        "name":"test6",       
        "age" : "16",       
        "gender":"male",        
        "email" : "test6@gmail.com",        
        "phoneNo" : "9415346318" 
      }
    ];
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(() => {

                // authenticate
                if (url.endsWith('/users/authenticate') && opts.method === 'POST') {
                    // get parameters from post request
                    let params = JSON.parse(opts.body);

                    // find if any user matches login credentials
                    let filteredUsers = users.filter(user => {
                        return user.username === params.username && user.password === params.password;
                    });

                    if (filteredUsers.length) {
                        // if login details are valid return user details and fake jwt token
                        let user = filteredUsers[0];
                        let responseJson = {
                            id: user.id,
                            username: user.username,
                            age: user.age,
                            gender: user.gender,
                            token: 'fake-jwt-token'
                        };
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(responseJson)) });
                    } else {
                        // else return error
                        reject('Username or password is incorrect');
                    }

                    return;
                }

                // get users
                if (url.endsWith('/users') && opts.method === 'GET') {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(users))});
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }

                    return;
                }

                // pass through any requests not handled above
                realFetch(url, opts).then(response => resolve(response));

            }, 500);
        });
    }
}