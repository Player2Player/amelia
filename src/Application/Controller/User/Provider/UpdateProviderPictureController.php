<?php

namespace AmeliaBooking\Application\Controller\User\Provider;

use AmeliaBooking\Application\Commands\User\Provider\UpdateProviderPictureCommand;
use AmeliaBooking\Application\Controller\Controller;
use Slim\Http\Request;

/**
 * Class UpdateProviderPictureController
 *
 * @package AmeliaBooking\Application\Controller\User\Provider
 */
class UpdateProviderPictureController extends Controller
{
   
    /**
     * Instantiates the Update Provider Status command to hand it over to the Command Handler
     *
     * @param Request $request
     * @param         $args
     *
     * @return UpdateProviderPictureCommand
     * @throws \RuntimeException
     */
    protected function instantiateCommand(Request $request, $args)
    {
        $command = new UpdateProviderPictureCommand($args);
        $command->setFile($_FILES["file"]);
        return $command;
    }
}
