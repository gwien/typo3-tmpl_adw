<?php
if (!defined('TYPO3_MODE')) {
	die ('Access denied.');
}

// Add page TSConfig
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig(
	'<INCLUDE_TYPOSCRIPT: source="FILE:EXT:' . $_EXTKEY . '/Configuration/TypoScript/PageTS/setup.txt">'
);
?>
