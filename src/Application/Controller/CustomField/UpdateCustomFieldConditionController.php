<?php

namespace AmeliaBooking\Application\Controller\CustomField;

use AmeliaBooking\Application\Commands\CustomField\UpdateCustomFieldConditionCommand;
use AmeliaBooking\Application\Controller\Controller;
use Slim\Http\Request;

/**
 * Class UpdateCustomFieldConditionController
 *
 * @package AmeliaBooking\Application\Controller\CustomField
 */
class UpdateCustomFieldConditionController extends Controller
{
    /**
     * Fields for user that can be received from front-end
     *
     * @var array
     */
    protected $allowedFields = [
        'id',
        'customFieldId',
        'customFieldCondition',
        'operator',
        'value'
    ];

    /**
     * @param Request $request
     * @param         $args
     *
     * @return UpdateCustomFieldConditionCommand
     * @throws \RuntimeException
     */
    protected function instantiateCommand(Request $request, $args)
    {
        $command = new UpdateCustomFieldConditionCommand($args);
        $requestBody = $request->getParsedBody();
        $this->setCommandFields($command, $requestBody);

        return $command;
    }
}
