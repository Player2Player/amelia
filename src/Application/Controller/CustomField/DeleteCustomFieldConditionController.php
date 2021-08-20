<?php

namespace AmeliaBooking\Application\Controller\CustomField;

use AmeliaBooking\Application\Commands\CustomField\DeleteCustomFieldConditionCommand;
use AmeliaBooking\Application\Controller\Controller;
use Slim\Http\Request;

/**
 * Class DeleteCustomFieldConditionController
 *
 * @package AmeliaBooking\Application\Controller\CustomField
 */
class DeleteCustomFieldConditionController extends Controller
{
    /**
     * @param Request $request
     * @param         $args
     *
     * @return DeleteCustomFieldConditionCommand
     */
    protected function instantiateCommand(Request $request, $args)
    {
        $command = new DeleteCustomFieldConditionCommand($args);
        $requestBody = $request->getParsedBody();
        $this->setCommandFields($command, $requestBody);

        return $command;
    }
}
