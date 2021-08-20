<?php

namespace AmeliaBooking\Application\Commands\CustomField;

use AmeliaBooking\Application\Commands\CommandHandler;
use AmeliaBooking\Application\Commands\CommandResult;
use AmeliaBooking\Application\Common\Exceptions\AccessDeniedException;
use AmeliaBooking\Domain\Entity\CustomField\CustomFieldCondition;
use AmeliaBooking\Domain\Entity\Entities;
use AmeliaBooking\Domain\Factory\CustomField\CustomFieldConditionFactory;
use AmeliaBooking\Domain\ValueObjects\Number\Integer\Id;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Repository\CustomField\CustomFieldConditionRepository;

/**
 * Class UpdateCustomFieldConditionCommandHandler
 *
 * @package AmeliaBooking\Application\Commands\CustomField
 */
class UpdateCustomFieldConditionCommandHandler extends CommandHandler
{
    /**
     * @param UpdateCustomFieldConditionCommand $command
     *
     * @return CommandResult
     * @throws AccessDeniedException
     * @throws \AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException
     * @throws \Interop\Container\Exception\ContainerException
     * @throws QueryExecutionException
     */
    public function handle(UpdateCustomFieldConditionCommand $command)
    {
        if (!$this->getContainer()->getPermissionsService()->currentUserCanWrite(Entities::CUSTOM_FIELDS)) {
            throw new AccessDeniedException('You are not allowed to update custom fields.');
        }

        $result = new CommandResult();

        $fieldConditionArray = $command->getFields();

        $fieldCondition = CustomFieldConditionFactory::create($fieldConditionArray);

        if (!$fieldCondition instanceof CustomFieldCondition) {
            $result->setResult(CommandResult::RESULT_ERROR);
            $result->setMessage('Could not update custom field condition.');

            return $result;
        }

        /** @var CustomFieldConditionRepository $customFieldConditionRepository */
        $customFieldConditionRepository = $this->container->get('domain.customFieldCondition.repository');

        $id = $command->getArg('id');
        $customFieldConditionRepository->update($id, $fieldCondition);
        $fieldCondition->setId(new Id($id));

        $result->setResult(CommandResult::RESULT_SUCCESS);
        $result->setMessage('Successfully updated custom condition field.');
        $result->setData([
            'customFieldCondition' => $fieldCondition->toArray()
        ]);

        return $result;
    }

}
