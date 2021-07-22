<?php

namespace AmeliaBooking\Application\Commands\Location;

use AmeliaBooking\Application\Common\Exceptions\AccessDeniedException;
use AmeliaBooking\Domain\Common\Exceptions\InvalidArgumentException;
use AmeliaBooking\Domain\Entity\Entities;
use AmeliaBooking\Domain\Entity\Location\Location;
use AmeliaBooking\Domain\Factory\Location\LocationFactory;
use AmeliaBooking\Application\Commands\CommandResult;
use AmeliaBooking\Application\Commands\CommandHandler;
use AmeliaBooking\Infrastructure\Common\Exceptions\QueryExecutionException;
use AmeliaBooking\Infrastructure\Repository\Location\LocationRepository;
use AmeliaBooking\Domain\ValueObjects\String\Slug;

/**
 * Class UpdateLocationCommandHandler
 *
 * @package AmeliaBooking\Application\Commands\Location
 */
class UpdateLocationCommandHandler extends CommandHandler
{

    /**
     * @var array
     */
    public $mandatoryFields = [
        'name',
        'address',
        'phone',
        'latitude',
        'longitude'
    ];

    /**
     * @param UpdateLocationCommand $command
     *
     * @return CommandResult
     * @throws \Slim\Exception\ContainerValueNotFoundException
     * @throws QueryExecutionException
     * @throws InvalidArgumentException
     * @throws AccessDeniedException
     * @throws \Interop\Container\Exception\ContainerException
     */
    public function handle(UpdateLocationCommand $command)
    {
        if (!$this->getContainer()->getPermissionsService()->currentUserCanWrite(Entities::LOCATIONS)) {
            throw new AccessDeniedException('You are not allowed to update location!');
        }

        $result = new CommandResult();

        $this->checkMandatoryFields($command);

        $location = LocationFactory::create($command->getFields());
        if (!$location instanceof Location) {
            $result->setResult(CommandResult::RESULT_ERROR);
            $result->setMessage('Could not update location.');

            return $result;
        }
        
        // create location slug from name
        $slug = sanitize_title($location->getName()->getValue());
        $slug = substr($slug, 0, Slug::MAX_LENGTH);
        $location->setSlug(new Slug($slug));

        /** @var LocationRepository $locationRepository */
        $locationRepository = $this->container->get('domain.locations.repository');
        if ($locationRepository->update($command->getArg('id'), $location)) {
            $result->setResult(CommandResult::RESULT_SUCCESS);
            $result->setMessage('Successfully updated location.');
            $result->setData([
                Entities::LOCATION => $location->toArray()
            ]);
        }

        return $result;
    }
}
