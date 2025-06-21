<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verify Your Email Address</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4f46e5;
            padding: 20px;
            color: white;
            text-align: center;
        }
        .content {
            padding: 20px;
            background-color: #f8f9fa;
        }
        .button {
            display: inline-block;
            background-color: #4f46e5;
            color: white !important;
            text-decoration: none;
            padding: 10px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Verify Your Email Address</h1>
    </div>
    
    <div class="content">
        <p>Hello {{ $user->name }},</p>
        
        <p>Thank you for registering with IdeaHub! To complete your registration and access your account, please verify your email address.</p>
        
        <p>Click the button below to verify your email:</p>
        
        <a href="{{ $verificationUrl }}" class="button">Verify Email Address</a>
        
        <p>Or copy and paste this URL into your browser:</p>
        <p>{{ $verificationUrl }}</p>
        
        <p>This link will expire in 60 minutes.</p>
        
        <p>If you did not create an account, no further action is required.</p>
        
        <p>Thank you,<br>IdeaHub Team</p>
    </div>
    
    <div class="footer">
        <p>&copy; {{ date('Y') }} IdeaHub. All rights reserved.</p>
    </div>
</body>
</html>
