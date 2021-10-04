<?php

namespace AmeliaBooking\Application\Commands\User\Provider;

use AmeliaBooking\Application\Common\Exceptions\AccessDeniedException;
use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\Entity\Entities;
use AmeliaBooking\Application\Commands\CommandResult;
use AmeliaBooking\Application\Commands\CommandHandler;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Repository\User\ProviderRepository;

/**
 * Class UpdateProviderPictureCommandHandler
 *
 * @package AmeliaBooking\Application\Common
 */
class UpdateProviderPictureCommandHandler extends CommandHandler
{
  

    /**
     * @param UpdateProviderPictureCommand $command
     *
     * @return CommandResult
     * @throws \Slim\Exception\ContainerException
     * @throws \InvalidArgumentException
     * @throws \Slim\Exception\ContainerValueNotFoundException
     * @throws QueryExecutionException
     * @throws InvalidArgumentException
     * @throws AccessDeniedException
     * @throws \Interop\Container\Exception\ContainerException
     */
    public function handle(UpdateProviderPictureCommand $command)
    {
        if (!$this->getContainer()->getPermissionsService()->currentUserCanWrite(Entities::EMPLOYEES)) {
            throw new AccessDeniedException('You are not allowed to update employee.');
        }
        
        /** @var int $providerId */
        $providerId = (int)$command->getField('id');

        $file = $command->getFile();
        
        $result = new CommandResult();

        /** @var ProviderRepository $providerRepository */
        $providerRepository = $this->container->get('domain.users.providers.repository');

        //$providerRepository->updateFieldById($command->getArg('id'), $command->getField('status'), 'status');

        $result->setResult(CommandResult::RESULT_SUCCESS);
        $result->setMessage('Successfully updated picture profile');
        $result->setData([
          "providerId" => $providerId,
          "file" => $file
        ]);

        return $result;
    }
}
