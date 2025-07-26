<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstName = htmlspecialchars($_POST['first_name']);
    $lastName  = htmlspecialchars($_POST['last_name']);
    $email     = htmlspecialchars($_POST['email']);
    $phone     = htmlspecialchars($_POST['phone']);
    $message   = htmlspecialchars($_POST['message']);

    $to = "dbrightson6@gmail.com"; // ✅ Replace with your email
    $subject = "New Contact Form Message from $firstName $lastName";
    $body = "
    Name: $firstName $lastName
    Email: $email
    Phone: $phone
    Message:
    $message
    ";
    $headers = "From: $email\r\nReply-To: $email";

    if (mail($to, $subject, $body, $headers)) {
        echo "<h2 style='text-align:center;color:green;'>Message Sent Successfully!</h2>";
    } else {
        echo "<h2 style='text-align:center;color:red;'>Failed to send message. Please try again.</h2>";
    }
}
?>
