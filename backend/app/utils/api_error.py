class ApiError(Exception):
    def __init__(self, status_code, message="Something Went Wrong!", stack=None, errors=None):
        super().__init__(message)
        self.status_code = status_code
        self.message = message
        self.data = None
        self.errors = errors
        self.success = False

        if stack:
            self.stack = stack
        else:
            import traceback
            self.stack = traceback.format_exc()