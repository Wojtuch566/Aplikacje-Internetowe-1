<?php

/** @var \App\Model\Game $game */
/** @var \App\Service\Router $router */

$title = "{$game->getGameName()} ({$game->getGameId()})";
$bodyClass = 'show';

ob_start();
?>
<h1><?= $game->getGameName(); ?></h1>
<article>
    <p>Release Date: <b><?= $game->getGameReleaseDate() ?></b></p>
    <p>Publisher: <b><?= $game->getGamePublisher() ?></b></p>
</article>

<ul class="action-list">
    <li><a href="<?= $router->generatePath('game-index') ?>">Back to list</a></li>
    <li><a href="<?= $router->generatePath('game-edit', ['gameId' => $game->getGameId()]) ?>">Edit</a></li>
</ul>
<?php $main = ob_get_clean();

include __DIR__.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'base.html.php';
