<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reset Your Password</title>
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
        <h1>Reset Your Password</h1>
    </div>
    
    <div class="content">
        <p>Hello {{ $user->name }},</p>
        
        <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
        
        <p>To reset your password, click the button below:</p>
        
        <a href="{{ $resetLink }}" class="button">Reset Password</a>
        
        <p>Or copy and paste this URL into your browser:</p>
        <p>{{ $resetLink }}</p>
        
        <p>This link will expire in 60 minutes.</p>
        
        <p>Thank you,<br>ApiHub Team</p>
    </div>
    
    <div class="footer">
        <p>&copy; {{ date('Y') }} ApiHub. All rights reserved.</p>
    </div>
</body>
</html>
