<?php

namespace AmeliaBooking\Application\Controller\CustomField;

use AmeliaBooking\Application\Commands\CustomField\AddCustomFieldConditionCommand;
use AmeliaBooking\Application\Controller\Controller;
use Slim\Http\Request;

/**
 * Class AddCustomFieldConditionController
 *
 * @package AmeliaBooking\Application\Controller\CustomField
 */
class AddCustomFieldConditionController extends Controller
{
    /**
     * Fields for user that can be received from front-end
     *
     * @var array
     */
    protected $allowedFields = [
        'customFieldId',
        'customFieldCondition',
        'operator',
        'value'
    ];

    /**
     * @param Request $request
     * @param         $args
     *
     * @return AddCustomFieldConditionCommand
     * @throws \RuntimeException
     */
    protected function instantiateCommand(Request $request, $args)
    {
        $command = new AddCustomFieldConditionCommand($args);
        $requestBody = $request->getParsedBody();
        $this->setCommandFields($command, $requestBody);

        return $command;
    }
}
