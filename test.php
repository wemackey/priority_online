<?php
$video_array = array
('http://www.youtube.com/v/rMNNDINCFHg&hl=en&fs=1&',
'http://www.youtube.com/v/bDF6DVzKFFg&hl=en&fs=1&',
'http://www.youtube.com/v/swb8AEcRJhY&hl=en&fs=1&');
$total = count($video_array);
$random = (mt_rand()%$total);
$video = "$video_array[$random]";
?>

<html>
<head>
<title>Random YouTube Video - Array</title>
<style type="text/css">
#example {
    width:425px;
    height:344px;
    position:absolute;
}
</style>
</head>
<body>
<div id="example">
<object width="425" height="344">
<param name="movie" value="<?php echo $video; ?>"></param>
<param name="allowFullScreen" value="true"></param>
<param name="allowscriptaccess" value="always"></param>
<embed src="<?php echo $video; ?>" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="425" height="344">
</embed></object>
</div>
</body>
</html>
