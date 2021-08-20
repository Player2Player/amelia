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
 * Class DeleteCustomFieldConditionCommandHandler
 *
 * @package AmeliaBooking\Application\Commands\CustomField
 */
class DeleteCustomFieldConditionCommandHandler extends CommandHandler
{
    /**
     * @param DeleteCustomFieldConditionCommand $command
     *
     * @return CommandResult
     * @throws AccessDeniedException
     * @throws \AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException
     * @throws \Interop\Container\Exception\ContainerException
     * @throws QueryExecutionException
     */
    public function handle(DeleteCustomFieldConditionCommand $command)
    {
        if (!$this->getContainer()->getPermissionsService()->currentUserCanWrite(Entities::CUSTOM_FIELDS)) {
            throw new AccessDeniedException('You are not allowed to delete custom fields.');
        }

        $result = new CommandResult();

        /** @var CustomFieldConditionRepository $customFieldConditionRepository */
        $customFieldConditionRepository = $this->container->get('domain.customFieldCondition.repository');

        $id = $command->getArg('id');
        $customFieldConditionRepository->delete($id);

        $result->setResult(CommandResult::RESULT_SUCCESS);
        $result->setMessage('Successfully deleted custom condition field.');

        return $result;
    }

}
