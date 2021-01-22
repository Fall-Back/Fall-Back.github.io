<?php
$output = ob_get_contents();
ob_end_clean();

#$output = str_replace('http://localhost:4001/', 'https://lab.npeu.ox.ac.uk/mockup/', $output);
$output = str_replace('href="/',         'href="/fallback/', $output);
$output = str_replace('src="/',          'src="/fallback/', $output);
$output = str_replace('link.href = \'/', 'link.href = \'/fallback/', $output);
#$output = str_replace('/downloads',     '/fallback/downloads', $output);
#$output = str_replace('/img',           '/fallback/img', $output);
#$output = str_replace('data="/',        'data="/fallback/', $output);
$output = str_replace('name="msapplication-config" content="/', 'name="msapplication-config" content="/fallback/', $output);

echo $output;
?>