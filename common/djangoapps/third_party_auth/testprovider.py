from social.backends.oauth import BaseOAuth2
import json


class OAuth2(BaseOAuth2):
    """civicedu OAuth authentication backend"""

    # callback name
    name = 'test'
    AUTHORIZATION_URL = 'http://nhi.kr/oauth/login'
    ACCESS_TOKEN_URL = 'http://nhi.kr/oauth/token'
    SCOPE_SEPARATOR = ','
    ACCESS_TOKEN_METHOD = 'POST'
    EXTRA_DATA = [
        ('id', 'id'),
        ('expires', 'expires'),
        ('login', 'login')
    ]

    def get_user_details(self, response):

        print 'response ---------------- s'
        print response
        print 'response ---------------- e'

        """Return user details from Github account"""
        jsonString = dict()
        jsonString['login'] = response.get('user_id')
        jsonString['email'] = response.get('email')
        jsonString['name'] = response.get('name')
        jsonString['id'] = response.get('id')

        print '***********************'
        print jsonString
        print '***********************'

        return json.loads(json.dumps(jsonString))

    def user_data(self, access_token, *args, **kwargs):
        """Loads user data from service"""
        print '::: test :::  user_data called!!'

        str = self.get_json('http://nhi.kr/oauth/info', params={'access_token': access_token})

        try:
            return str
        except ValueError:
            return None

    def auth_complete(self, *args, **kwargs):

        print 'auth_complete called1'
        print self.ACCESS_TOKEN_URL
        print '----------------------------------------- 1'
        print self.auth_complete_params()
        print '----------------------------------------- 2'
        print self.auth_headers()
        print '----------------------------------------- 3'
        print self.ACCESS_TOKEN_METHOD
        print 'auth_complete called2'

        response = self.request_access_token(
            self.ACCESS_TOKEN_URL,
            data=self.auth_complete_params(),
            headers=self.auth_headers(),
            method=self.ACCESS_TOKEN_METHOD
        )
        self.process_error(response)

        print '===================================>', response['access_token']
        return self.do_auth(response['access_token'], response=response,
                            *args, **kwargs)
